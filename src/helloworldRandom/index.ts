import {GetRandomPasswordCommand, SecretsManagerClient} from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient();

export async function handler() {

    const command = new GetRandomPasswordCommand({
        ExcludeCharacters: '"@/\\',
        PasswordLength: 20,
    });

    const response = await client.send(command);

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: `Hello World, your random password is: ${response.RandomPassword}`,
        }),
    };
}