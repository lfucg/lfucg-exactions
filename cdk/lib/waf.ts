import * as wafv2 from 'aws-cdk-lib/aws-wafv2';
import { Construct } from 'constructs';

export class WAF extends wafv2.CfnWebACL {
  constructor(scope: Construct, id: string) {
    // const badActorIpSet = new wafv2.CfnIPSet(scope, 'BadActorIPs', {
    //   addresses: ['199.102.66.195/32'],
    //   ipAddressVersion: 'IPV4',
    //   scope: 'REGIONAL',
    //   description: 'List of bad actor IPs',
    // });

    super(scope, id, {
      name: id,
      scope: 'REGIONAL',
      defaultAction: { allow: {} },
      visibilityConfig: {
        cloudWatchMetricsEnabled: true,
        metricName: id,
        sampledRequestsEnabled: false,
      },
      description: 'Web application firewall to mitigate common threats',
      rules: [
        {
          name: 'CommonRuleSet',
          priority: 0,
          statement: {
            managedRuleGroupStatement: {
              name: 'AWSManagedRulesCommonRuleSet',
              vendorName: 'AWS',
              ruleActionOverrides: [
                {
                  name: 'SizeRestrictions_BODY',
                  actionToUse: { allow: {} },
                },
                {
                  name: 'SizeRestrictions_QUERYSTRING',
                  actionToUse: { allow: {} },
                },
              ],
            },
          },
          visibilityConfig: {
            cloudWatchMetricsEnabled: true,
            metricName: `${id}-CommonRuleSet`,
            sampledRequestsEnabled: true,
          },
          overrideAction: { none: {} },
        },
        // {
        //   name: 'BlockBadActorIps',
        //   priority: 1,
        //   statement: {
        //     ipSetReferenceStatement: {
        //       arn: badActorIpSet.attrArn,
        //     },
        //   },
        //   visibilityConfig: {
        //     cloudWatchMetricsEnabled: true,
        //     metricName: 'BlockBadActorIpSet',
        //     sampledRequestsEnabled: true,
        //   },
        //   action: { block: {} },
        // },
      ],
    });
  }

  public createAssociation(scope: Construct, id: string, resourceArn: string) {
    new wafv2.CfnWebACLAssociation(scope, id, {
      resourceArn,
      webAclArn: this.attrArn,
    });
  }
}
