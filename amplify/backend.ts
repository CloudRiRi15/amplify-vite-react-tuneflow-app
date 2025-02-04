import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import {paymentWebhook} from './funtions/paymentWebhook/resource'
import { Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { AuthorizationType, Cors, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Stack } from 'aws-cdk-lib';

const backend = defineBackend({
  auth,
  data,
  storage,
  paymentWebhook,
});

backend.paymentWebhook.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['ses:sendemail', 'ses:SendRawEmail'],
    resources: ['*']
  })
)
const lambdaIntegration = new LambdaIntegration(
  backend.paymentWebhook.resources.lambda
);
const apiStack = backend.createStack("api-stack");
const myRestApi = new RestApi(apiStack, "RestApi", {
  restApiName: "digitalFileApi",
  deploy: true,
  deployOptions: {
    stageName: "dev",
  },
  defaultCorsPreflightOptions: {
    allowOrigins: Cors.ALL_ORIGINS, // Restrict this to domains you trust
    allowMethods: Cors.ALL_METHODS, // Specify only the methods you need to allow
    allowHeaders: Cors.DEFAULT_HEADERS, // Specify only the headers you need to allow
  },
});

const itemsPath = myRestApi.root.addResource("items", {
  defaultMethodOptions: {
    authorizationType: AuthorizationType.NONE,
  },
});
itemsPath.addMethod("POST", lambdaIntegration, );

new Policy(apiStack, "RestApiPolicy", {
  statements: [
    new PolicyStatement({
      actions: ["execute-api:Invoke"],
      resources: [
        `${myRestApi.arnForExecuteApi("*", "/items", "dev")}`,
      ],
    }),
  ],
});

backend.addOutput({
  custom: {
    API: {
      [myRestApi.restApiName]: {
        endpoint: myRestApi.url,
        region: Stack.of(myRestApi).region,
        apiName: myRestApi.restApiName,
      },
    },
  },
});
