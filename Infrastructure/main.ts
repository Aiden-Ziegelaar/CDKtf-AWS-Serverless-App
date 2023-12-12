import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";

import { TsLambdaFunction } from "./constructs/lambda";
import { AwsProvider } from "@cdktf/provider-aws/lib/provider";
import { ArchiveProvider } from "@cdktf/provider-archive/lib/provider";
import { iamPolicy } from "@cdktf/provider-aws";

let rootDir = process.cwd() + "/../";

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string, config: {environment: string}) {
    super(scope, id);

    new AwsProvider(this, "aws", {
      region: "ap-southeast-2",
    });

    new ArchiveProvider(this, "archive", {});

    let secretsManagerPolicy = new iamPolicy.IamPolicy(
      this, `Policy-SecretsManager-RandomPassword_${config.environment}`, 
      {
        name: `Policy-SecretsManager-RandomPassword_${config.environment}`,
        policy: JSON.stringify({
          Version: "2012-10-17",
          Statement: [
            {
              Action: [
                "secretsmanager:GetRandomPassword",
              ],
              Effect: "Allow",
              Resource: "*",
            },
          ],
        }),
    })

    new TsLambdaFunction(this, `HelloWorld-Ts-Random_${config.environment}`, {
      filepath: `${rootDir}build/helloworldRandom`,
      policiesToAttach: [secretsManagerPolicy]
    })

    new TsLambdaFunction(this, `HelloWorld-Ts_${config.environment}`, {
      filepath: `${rootDir}build/helloworld`
    })
  }
}

const app = new App();
new MyStack(app, "Infrastructure", {environment: "dev"});
new MyStack(app, "Infrastructure-prod", {environment: "prod"});
app.synth();


new DynamodbTable(this, "first-table", {
  name: `a-dynamo-table`,
  hashKey: "pKey",
  attribute: [{ name: "id", type: "S" }],
  billingMode: "PAY_PER_REQUEST",
});