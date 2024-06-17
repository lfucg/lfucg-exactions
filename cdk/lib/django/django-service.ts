import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as cr from 'aws-cdk-lib/custom-resources';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecrassets from 'aws-cdk-lib/aws-ecr-assets';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsp from 'aws-cdk-lib/aws-ecs-patterns';
import * as elb from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as core from '@apaxsoftware/cdk-core';
import AppEnvironment from '../app-env';
import { DjangoEnvVars, DjangoSecrets } from './django-env-vars';
import { DbConfig } from '../app-database';

export interface DjangoServiceInputProps {
  vpc: ec2.IVpc;
  cluster: ecs.ICluster;
  defaultSG: ec2.ISecurityGroup;
  dockerImageAsset: ecrassets.DockerImageAsset;
  environment: Omit<DjangoEnvVars, 'DJANGO_SETTINGS_MODULE'>;
  domainSettings: core.DomainSettings;
  dbConfig: DbConfig;
}

export default class DjangoService extends Construct {
  /** The load balancer for the fargate tasks */
  public readonly loadBalancer: elb.ApplicationLoadBalancer;

  constructor(env: AppEnvironment, inputProps: DjangoServiceInputProps) {
    super(env, `DjangoService-${env.id}`);

    const { vpc, cluster, defaultSG, dockerImageAsset, environment, domainSettings, dbConfig } =
      inputProps;

    const serviceSpecs = {
      desiredCount: 1,
      cpu: 1024,
      memoryLimitMiB: 2048,
    };

    // if (env.envType === 'prod') {
    //   serviceSpecs.desiredCount = 2;
    //   serviceSpecs.cpu = 2048;
    //   serviceSpecs.memoryLimitMiB = 4096;
    // }

    const service = new ecsp.ApplicationLoadBalancedFargateService(this, 'FargateService', {
      ...serviceSpecs,
      ...domainSettings,
      serviceName: 'exactions',
      cluster,
      sslPolicy: elb.SslPolicy.RECOMMENDED_TLS,
      redirectHTTP: true,
      publicLoadBalancer: true,
      enableExecuteCommand: true,
      securityGroups: [defaultSG],
      // circuitBreaker: { rollback: true },
      taskImageOptions: {
        image: ecs.ContainerImage.fromDockerImageAsset(dockerImageAsset),
        containerPort: 8000,
        secrets: {
          ...env.configSecret.ecs,
          ...dbConfig,
        } satisfies DjangoSecrets,
        environment: core.coercePythonEnvVars({
          ...environment,
          DJANGO_SETTINGS_MODULE: 'config.settings.production',
        } satisfies DjangoEnvVars & { DJANGO_SETTINGS_MODULE: 'config.settings.production' }),
      },
    });
    this.loadBalancer = service.loadBalancer;
    service.targetGroup.configureHealthCheck({
      path: '/health',
      healthyThresholdCount: 2,
      interval: cdk.Duration.seconds(15),
    });

    // Lower the draining time from the default 300s to 10s
    service.targetGroup.setAttribute('deregistration_delay.timeout_seconds', '10');

    // Run database migrations when task definition changes
    const migrateResource = new cr.AwsCustomResource(this, `MigrateResource-${env.id}`, {
      resourceType: 'Custom::MigrateResource',
      installLatestAwsSdk: false,
      onUpdate: {
        service: 'ECS',
        action: 'runTask',
        physicalResourceId: cr.PhysicalResourceId.of(`MigrateResource-${env.id}`),
        parameters: {
          startedBy: 'Custom::MigrateResource',
          cluster: cluster.clusterName,
          taskDefinition: service.taskDefinition.taskDefinitionArn,
          count: 1,
          launchType: 'FARGATE',
          overrides: {
            containerOverrides: [{ name: 'web', command: ['/migrate.sh'] }],
          },
          networkConfiguration: {
            awsvpcConfiguration: {
              subnets: vpc.privateSubnets.map((subnet) => subnet.subnetId),
              securityGroups: [defaultSG.securityGroupId],
            },
          },
          platformVersion: 'LATEST',
        },
      },
      policy: cr.AwsCustomResourcePolicy.fromStatements([
        new iam.PolicyStatement({
          actions: ['ecs:runTask', 'iam:PassRole'],
          resources: ['*'],
        }),
      ]),
    });
    // Wait to run after service deployment has succeeded
    migrateResource.node.addDependency(service.service);
  }
}
