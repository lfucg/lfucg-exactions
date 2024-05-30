import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secmgr from 'aws-cdk-lib/aws-secretsmanager';
import * as core from '@apaxsoftware/cdk-core';

export interface AppDatabaseProps {
  vpc: ec2.IVpc;
  defaultSG: ec2.ISecurityGroup;
}

export interface DbConfig {
  DB_USER: ecs.Secret;
  DB_PASSWORD: ecs.Secret;
}

export default class AppDatabase extends Construct {
  /** The database used by django */
  public readonly database: rds.IDatabaseInstance;

  /** The connection pooler for the database */
  public readonly databaseProxy?: rds.IDatabaseProxy;

  /** The generated database secret fields in ECS format */
  public readonly dbConfig: DbConfig;

  constructor(scope: Construct, id: string, props: AppDatabaseProps) {
    super(scope, id);

    const { vpc, defaultSG } = props;

    const databaseSecret = new secmgr.Secret(this, 'DbSecret', {
      secretName: `exactions_db_config`,
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'django' }),
        generateStringKey: 'password',
        passwordLength: 32,
        includeSpace: false,
        excludePunctuation: true,
      },
    });

    this.dbConfig = {
      DB_USER: ecs.Secret.fromSecretsManager(databaseSecret, 'username'),
      DB_PASSWORD: ecs.Secret.fromSecretsManager(databaseSecret, 'password'),
    };

    const engine = rds.DatabaseInstanceEngine.postgres({
      version: rds.PostgresEngineVersion.VER_14_10,
    });
    
    this.database = new rds.DatabaseInstance(this, 'Database-exactions', {
      instanceIdentifier: 'exactions',
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.SMALL,
      ),
      engine,
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      securityGroups: [defaultSG],
      credentials: rds.Credentials.fromSecret(databaseSecret),
      enablePerformanceInsights: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    this.databaseProxy = this.database.addProxy('DatabaseProxy-exactions', {
      dbProxyName: 'exactions-db-proxy',
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      secrets: [databaseSecret],
      securityGroups: [defaultSG],
    });
  }
}
