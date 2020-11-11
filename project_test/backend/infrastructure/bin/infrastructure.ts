#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { InfrastructureStack } from '../lib/infrastructure-stack';

const CDK_ENV = process.env.ENV || 'dev';
const CDK_REGION = 'us-west-2';

const app = new cdk.App();
new InfrastructureStack(app, `InfrastructureStack-${CDK_ENV}`, {
  env: {
    region: CDK_REGION,
  }
});
