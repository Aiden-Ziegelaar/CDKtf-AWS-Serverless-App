import {GetRandomPasswordCommand, SecretsManagerClient} from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient();

export function handler() {

    const command = new GetRandomPasswordCommand({
        ExcludeCharacters: '"@/\\',
        PasswordLength: 20,
    });

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Hello World",
        }),
    };
}