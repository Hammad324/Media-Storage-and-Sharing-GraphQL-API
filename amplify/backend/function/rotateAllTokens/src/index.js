const {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} = require("@aws-sdk/client-cognito-identity-provider");
const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const jwt = require("jsonwebtoken");

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.REGION || "us-east-1",
});
const dynamoClient = new DynamoDBClient({
  region: process.env.REGION || "us-east-1",
});

exports.handler = async (event) => {
  try {
    console.log("Incoming  event: ", JSON.stringify(event, null, 2));

    const authHeader =
      event.request?.headers?.Authorization ||
      event.request?.headers?.authorization; // get auth header

    const refreshToken = event.request?.headers?.["x-refresh-token"];

    if (!authHeader || !refreshToken)
      return {
        // check if missing, throw and error
        idToken: null,
        accessToken: null,
        refreshToken: null,
        message:
          "Authorization and x-refresh-token headers, both are required.",
      };

    const decodeTokenId = jwt.decode(authHeader); // decode the tokenID

    const cognitoSubId = decodeTokenId.sub; // get the sub

    if (!cognitoSubId)
      return {
        // not possible but if no sub then throw error
        idToken: null,
        accessToken: null,
        refreshToken: null,
        message: "The user should be logged in.",
      };

    const userData = await dynamoClient.send(
      new GetItemCommand({
        TableName: process.env.DDB_TABLE,
        Key: { id: { S: cognitoSubId } },
        ProjectionExpression: "isActive",
      })
    );

    const isActive =
      userData.Item && userData.Item.isActive
        ? userData.Item.isActive.BOOL
        : false;

    if (!isActive) {
      return {
        idToken: null,
        accessToken: null,
        refreshToken: null,
        message: "The user should be logged in.",
      };
    }

    const command = new InitiateAuthCommand({
      AuthFlow: "REFRESH_TOKEN_AUTH",
      ClientId: process.env.CLIENT_ID,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    });

    const response = await cognitoClient.send(command);

    return {
      idToken: response.AuthenticationResult?.IdToken,
      accessToken: response.AuthenticationResult?.AccessToken,
      refreshToken: response.AuthenticationResult?.RefreshToken || refreshToken,
      message: "Tokens have been successfully rotated.",
    };
  } catch (err) {
    console.error("Error in login:", err);
    return {
      idToken: null,
      accessToken: null,
      refreshToken: null,
      message: err.message || "Token rotation has failed.",
    };
  }
};
