#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PROD_DOMAIN, SharedEnvironment } from '../lib/shared-env';
import AppEnvironment from '../lib/app-env';

const app = new cdk.App();

export const sharedEnv = new SharedEnvironment(app);

new AppEnvironment(app, {
  envType: 'dev',
  sharedEnv,
});

// new AppEnvironment(app, {
//   envType: 'prod',
//   sharedEnv,
//   certificate: sharedEnv.prodCertificate,
//   config: {

//   },
// });
