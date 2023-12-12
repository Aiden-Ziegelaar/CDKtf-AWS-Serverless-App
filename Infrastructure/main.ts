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

    new iamPolicy.IamPolicy(this, "HelloWorld-Ts-Policy", {
      
    })

    new TsLambdaFunction(this, "HelloWorld-Ts", {
      filepath: `${rootDir}build/helloworld`
    })
  }
}

const app = new App();
new MyStack(app, "Infrastructure");
app.synth();
