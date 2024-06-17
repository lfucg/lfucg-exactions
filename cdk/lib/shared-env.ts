import * as certmgr from 'aws-cdk-lib/aws-certificatemanager';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as secmgr from 'aws-cdk-lib/aws-secretsmanager';
import * as core from '@apaxsoftware/cdk-core';
import { Construct } from 'constructs';
import AppDatabase from './app-database';
import { WAF } from './waf';

export const PROD_DOMAIN = 'exactions.lexingtonky.gov';

export type SharedEnvironmentProps = Omit<core.EnvironmentProps, 'envType' | 'envName'>;

/** Resources that are shared across all stacks */
export class SharedEnvironment extends core.Environment {
  /** The VPC for all resources */
  public readonly vpc: ec2.IVpc;

  /** ID of the shared managed security group */
  public readonly securityGroupId: string;

  /** The hosted zone for `lfucg-exactions.apaxdev.com` */
  public readonly apaxdevDomainZone: core.CrossAccountApaxdevHostedZone;

  /** The ACM certificate for `*.lfucg-exactions.apaxdev.com` */
  public readonly apaxdevCertificate: certmgr.ICertificate;

  /** The hosted zone for `exactions.lexingtonky.gov` */
  public readonly prodDomainZone: route53.IHostedZone;

  /** The ACM certificate for `exactions.lexingtonky.gov` */
  public readonly prodCertificate: certmgr.ICertificate;

  /** Shared database for all environments */
  public readonly database: AppDatabase;

  /** The web application firewall for all environments */
  public readonly waf: WAF;

  constructor(scope: Construct, inputProps?: SharedEnvironmentProps) {
    super(scope, {
      ...(inputProps || {}),
      envType: 'shared',
      envName: 'exactions',
    });

    this.vpc = new core.Vpc(this, 'shared-vpc-lfucg-exactions');

    const sharedSG = new ec2.SecurityGroup(this, 'default-sg', {
      vpc: this.vpc,
    });
    sharedSG.addIngressRule(sharedSG, ec2.Port.allTraffic());
    this.securityGroupId = sharedSG.securityGroupId;

    this.apaxdevDomainZone = new core.CrossAccountApaxdevHostedZone(this, 'lfucg-exactions');
    const apaxDomainName = this.apaxdevDomainZone.zoneName;
    this.apaxdevCertificate = new certmgr.Certificate(this, `Cert-${apaxDomainName}`, {
      domainName: `*.${apaxDomainName}`,
      subjectAlternativeNames: [apaxDomainName],
      validation: certmgr.CertificateValidation.fromDns(this.apaxdevDomainZone),
    });

    this.prodDomainZone = route53.HostedZone.fromLookup(this, `ProdHostedZone`, {
      domainName: PROD_DOMAIN,
    });
    this.prodCertificate = new certmgr.Certificate(this, 'ProdCert', {
      domainName: PROD_DOMAIN,
      validation: certmgr.CertificateValidation.fromDns(this.prodDomainZone),
    });

    this.database = new AppDatabase(this, 'Database', {
      vpc: this.vpc,
      defaultSG: sharedSG,
    });

    this.waf = new WAF(this, 'shared-lfucg-exactions');

    // Used by session manager to allow port forwarding of RDS instances
    new ec2.BastionHostLinux(this, 'lfucg-exactions-bastion-host', {
      vpc: this.vpc,
      instanceName: 'lfucg-exactions-bastion-host',
      blockDevices: [
        {
          deviceName: '/dev/sdf',
          volume: ec2.BlockDeviceVolume.ebs(10, {
            encrypted: true,
          }),
        },
      ],
      securityGroup: sharedSG,
    });
  }
}
