import * as path from 'path';
import * as certmgr from 'aws-cdk-lib/aws-certificatemanager';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecrassets from 'aws-cdk-lib/aws-ecr-assets';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as secmgr from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import * as core from '@apaxsoftware/cdk-core';

import { DjangoEnvVars } from './django/django-env-vars';
import DjangoService from './django/django-service';
import { SharedEnvironment } from './shared-env';
import { WAF } from './waf';

export const configSecretFields = [
  'DJANGO_SECRET_KEY',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'POSTMARK_API_KEY',
] as const;

type AppConfig = typeof configSecretFields;

export interface AppEnvironmentProps extends Omit<core.EnvironmentProps, 'envName'> {
  /** The shared environment */
  sharedEnv: SharedEnvironment;

  /**
   * Hosted zone for `SITE_DOMAIN`
   *
   * @default sharedEnv.apaxdevDomainZone
   */
  domainZone?: route53.IHostedZone;

  /**
   * Certificate used for django service load balancer
   *
   * @default sharedEnv.apaxdevCertificate
   */
  certificate?: certmgr.ICertificate;

  /**
   * A web application firewall to attach to the django service load balancer
   *
   * @default sharedEnv.waf
   */
  waf?: WAF;

  /** Non-sensitive environment variables that **aren't** a function of CDK constructs */
  config?: Omit<
    DjangoEnvVars,
    'AWS_STORAGE_BUCKET_NAME' | 'DB_HOST' | 'DB_NAME' | 'DJANGO_SETTINGS_MODULE' | 'SITE_DOMAIN'
  > &
    Partial<Pick<DjangoEnvVars, 'SITE_DOMAIN'>>;
}

export default class AppEnvironment extends core.Environment {
  public readonly configSecret: core.StackSecret<AppConfig>;

  constructor(scope: Construct, inputProps: AppEnvironmentProps) {
    super(scope, { ...inputProps, envName: 'exactions' });

    const {
      config = {},
      sharedEnv,
      domainZone = sharedEnv.apaxdevDomainZone,
      certificate = sharedEnv.apaxdevCertificate,
      waf = sharedEnv.waf,
    } = inputProps;

    const { vpc, securityGroupId } = sharedEnv;

    const { database, databaseProxy, dbConfig } = sharedEnv.database;

    const defaultSG = ec2.SecurityGroup.fromSecurityGroupId(
      this,
      `DefaultVpcSG-${this.id}`,
      securityGroupId,
    );

    const stackUser = new iam.User(this, this.id, { userName: this.id });

    this.configSecret = new core.StackSecret(this, this.id, {
      secret: secmgr.Secret.fromSecretNameV2(
        this,
        `Secret-${this.id}`,
        `${this.envType}_${this.envName}_config`,
      ),
      fields: configSecretFields,
      generators: {
        DJANGO_SECRET_KEY: core.SecretGenerator.DJANGO_SECRET_KEY,
        AWS_ACCESS_KEY_ID: {
          type: core.SecretGenerator.USER_ACCESS_KEY_ID,
          userName: stackUser.userName,
        },
        AWS_SECRET_ACCESS_KEY: {
          type: core.SecretGenerator.USER_SECRET_ACCESS_KEY,
          userName: stackUser.userName,
        },
      },
    });

    const storageBucket = new core.PublicBucket(this, `${this.id}-media`, {
      writeUser: stackUser,
    });

    const dockerImageAsset = new ecrassets.DockerImageAsset(this, `DjangoDockerImage-${this.id}`, {
      directory: path.join(__dirname, '../../backend'),
      platform: ecrassets.Platform.LINUX_AMD64,
    });

    const { SITE_DOMAIN = `${this.envType}.lfucg-exactions.apaxdev.com`, ...restConfig } = config;

    const environment: DjangoEnvVars = {
      SITE_DOMAIN,
      DB_HOST: databaseProxy?.endpoint || database.dbInstanceEndpointAddress,
      DB_NAME: `${this.envType}_${this.envName}`,
      AWS_STORAGE_BUCKET_NAME: storageBucket.bucketName,
      ...restConfig,
    };

    const cluster = new ecs.Cluster(this, `Cluster-${this.id}`, {
      vpc,
      clusterName: this.id,
      containerInsights: true,
    });

    const djangoService = new DjangoService(this, {
      vpc,
      cluster,
      defaultSG,
      environment,
      dbConfig,
      dockerImageAsset: dockerImageAsset,
      domainSettings: {
        domainZone: domainZone,
        certificate,
        domainName: SITE_DOMAIN,
      },
    });

    // Allow CDK deployments from CircleCI
    stackUser.attachInlinePolicy(
      new iam.Policy(this, `CI-Policy-${this.id}`, {
        statements: [
          new iam.PolicyStatement({
            actions: ['sts:AssumeRole'],
            resources: ['arn:aws:iam::*:role/cdk-*'],
          }),
        ],
      }),
    );

    if (this.envType === 'prod') {
      waf.createAssociation(
        this,
        `WafAssociation-${this.envType}-exactions-alb`,
        djangoService.loadBalancer.loadBalancerArn,
      );
    }
  }
}
