const {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} = require("@aws-sdk/client-cognito-identity-provider");

const {
  DynamoDBClient,
  UpdateItemCommand,
} = require("@aws-sdk/client-dynamodb");

const client = new CognitoIdentityProviderClient({
  region: process.env.REGION || "us-east-1",
});
const dynamoClient = new DynamoDBClient({
  region: process.env.REGION || "us-east-1",
});

exports.handler = async (event) => {
  try {
    console.log("Incoming event:", JSON.stringify(event, null, 2));

    const { email, password } = event.arguments.input;

    const command = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: process.env.CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    const response = await client.send(command);

    const idToken = response?.AuthenticationResult?.IdToken;
    const decodeToken = decodeJWT(idToken);

    const cognitoSub = decodeToken.sub;

    await dynamoClient.send(
      new UpdateItemCommand({
        TableName: process.env.DDB_TABLE,
        Key: { id: { S: cognitoSub } },
        UpdateExpression: "SET isActive = :val, updatedAt = :updatedAt",
        ExpressionAttributeValues: {
          ":val": { BOOL: true },
          ":updatedAt": { S: new Date().toISOString() },
        },
        ReturnValues: "UPDATED_NEW",
      })
    );

    return {
      idToken: response.AuthenticationResult?.IdToken,
      accessToken: response.AuthenticationResult?.AccessToken,
      refreshToken: response.AuthenticationResult?.RefreshToken,
      message: "Login successful",
    };
  } catch (err) {
    console.error("Error in login:", err);
    return {
      idToken: null,
      accessToken: null,
      refreshToken: null,
      message: err.message || "Login failed",
    };
  }
};

function decodeJWT(token) {
  const payload = token.split(".")[1];
  return JSON.parse(Buffer.from(payload, "base64").toString("utf-8"));
}
