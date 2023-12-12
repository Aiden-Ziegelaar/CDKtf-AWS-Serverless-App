import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";

import { TsLambdaFunction } from "./constructs/lambda";
import { AwsProvider } from "@cdktf/provider-aws/lib/provider";
import { ArchiveProvider } from "@cdktf/provider-archive/lib/provider";
import { iamPolicy } from "@cdktf/provider-aws";

let rootDir = process.cwd() + "/../";

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AwsProvider(this, "aws", {
      region: "ap-southeast-2",
    });

    new ArchiveProvider(this, "archive", {});

    let secretsManagerPolicy = new iamPolicy.IamPolicy(this, "Policy-SecretsManager-RandomPassword", {
      name: "Policy-SecretsManager-RandomPassword",
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

    new TsLambdaFunction(this, "HelloWorld-Ts-Random", {
      filepath: `${rootDir}build/helloworldRandom`,
      policiesToAttach: [secretsManagerPolicy]
    })

    new TsLambdaFunction(this, "HelloWorld-Ts", {
      filepath: `${rootDir}build/helloworld`
    })
  }
}

const app = new App();
new MyStack(app, "Infrastructure");
app.synth();
