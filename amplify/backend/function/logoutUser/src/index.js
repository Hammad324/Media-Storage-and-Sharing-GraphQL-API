const {
  CognitoIdentityProviderClient,
  GlobalSignOutCommand,
} = require("@aws-sdk/client-cognito-identity-provider");

const { DynamoDBClient, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const { verifyJwtTokens } = require("/opt/nodejs/verifyJwtUtil");

const client = new CognitoIdentityProviderClient({
  region: process.env.REGION || "us-east-1",
});
const dynamoClient = new DynamoDBClient({ region: process.env.REGION || "us-east-1" })

exports.handler = async (event) => {
  try {
    console.log("Incoming logout event", JSON.stringify(event, null, 2));

    const authHeader =
      event.request?.headers?.Authorization ||
      event.request?.headers?.authorization;
    if (!authHeader) {
      return {
        success: false,
        message: "Authorization header is required.",
      };
    }

    const accessToken = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    const command = new GlobalSignOutCommand({ AccessToken: accessToken });
    await client.send(command);

    // const decoded = decodeJWT(accessToken);
    // const subId = decoded.sub

    const verifyToken = await verifyJwtTokens(
      accessToken,
      process.env.USER_POOL_ID,
      process.env.CLIENT_ID,
      "access"
    )

    await dynamoClient.send(
      new UpdateItemCommand({
        TableName: process.env.DDB_TABLE,
        Key: { userId: { S: verifyToken.sub } },
        UpdateExpression: "SET isActive = :val, updatedAt = :updatedAt",
        ExpressionAttributeValues: {
          ":val": { BOOL: false },
          ":updatedAt": { S: new Date().toISOString() },
        },
        ReturnValues: "UPDATED_NEW",
      })
    )

    return {
      success: true,
      message: "User logged out successfully",
    };
  } catch (err) {
    console.error("Error in logout:", err);
    return { success: false, message: err.message || "Logout failed" };
  }
};

// function decodeJWT(token) {
//   const payload = token.split(".")[1];
//   return JSON.parse(Buffer.from(payload, "base64").toString("utf-8"));
// }

