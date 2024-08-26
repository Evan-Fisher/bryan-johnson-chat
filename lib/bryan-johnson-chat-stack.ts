import { Stack, StackProps } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";

import { Construct } from "constructs";
export class BryanJohnsonChatStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Define the Lambda function
    const helloLambda = new lambda.Function(this, "HelloHandler", {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "api.handler",
    });

    const api = new apigateway.LambdaRestApi(this, "HelloWorldApi", {
      handler: helloLambda,
      proxy: false,
    });

    // Define the '/hello' resource with a GET method
    const helloResource = api.root.addResource("hello");
    helloResource.addMethod("GET");
  }
}
