import { Construct } from "constructs";

import * as aws from "@cdktf/provider-aws";
import * as archive from "@cdktf/provider-archive";

export class TsLambdaFunction extends Construct {
    constructor(scope: Construct, name: string, opts: {
        filepath: string,
        policiesToAttach?: aws.iamPolicy.IamPolicy[]
        lambdaOverride?: aws.lambdaFunction.LambdaFunctionConfig
    }) {
        super(scope, name);

        const lambdaRole = new aws.iamRole.IamRole(this, `${name}-lambda-role`, {
            name: `${name}_lambda-role`,
            assumeRolePolicy: JSON.stringify({
                Version: "2012-10-17",
                Statement: [
                    {
                        Action: "sts:AssumeRole",
                        Principal: {
                            Service: "lambda.amazonaws.com",
                        },
                        Effect: "Allow",
                    },
                ],
            }),
        });

        opts.policiesToAttach?.forEach((policy) => {
            new aws.iamRolePolicyAttachment.IamRolePolicyAttachment(this, `${name}-${policy.nameInput}-lambda-role-policy`, {
                role: lambdaRole.name,
                policyArn: policy.arn,
            });
        });

        const lambdaArchive = new archive.dataArchiveFile.DataArchiveFile(this, `${name}-lambda-archive`, {
            sourceDir: opts.filepath,
            outputPath: `./dist/${name}-lambda.zip`,
            type: "zip"
        });

        new aws.lambdaFunction.LambdaFunction(this, `${name}-lambda`, {
            functionName: name,
            runtime: "nodejs20.x",
            handler: "index.handler",
            role: lambdaRole.arn,
            filename: lambdaArchive.outputPath,
            sourceCodeHash: lambdaArchive.outputSha512,
            memorySize: 256,
            ...opts.lambdaOverride
        });
    }
}