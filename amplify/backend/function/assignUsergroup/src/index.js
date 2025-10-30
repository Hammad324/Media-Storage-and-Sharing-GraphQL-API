const {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
} = require("@aws-sdk/client-cognito-identity-provider");
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.REGION || "us-east-1",
});

const dynamoClient = new DynamoDBClient({
  region: process.env.REGION || "us-east-1",
});

exports.handler = async (event) => {
  try {
    console.log("Incoming  event: ", JSON.stringify(event, null, 2));

    if (event.triggerSource === "PostConfirmation_ConfirmSignUp") {
      const command = new AdminAddUserToGroupCommand({
        UserPoolId: event.userPoolId,
        Username: event.userName,
        GroupName: "user", // default user group, admin group can be assigned manually only.
      });

      try {
        const cognitoRes = await cognitoClient.send(command);
        console.log(cognitoRes)
        await dynamoClient.send(
          new PutItemCommand({
            TableName: process.env.DDB_TABLE,
            Item: {
              id: {S: event.userName},
              username: {S: event.request.userAttributes.preferred_username || event.userName},
              email: {S: event.request.userAttributes.email},
              role: { S: "user" },
              isActive: {BOOL: false},
              createdAt: { S: new Date().toISOString() },
              updatedAt: { S: new Date().toISOString() },
            },
          })
        );
        console.log(`User ${event.userName} has been registered.`);
      } catch (err) {
        console.log(`Error assigning the group: ${err}`);
      }
    }
  } catch (err) {
    console.log("Error while assigning group to the user: ", err);
    return {
      success: false,
      message: err.message || "Could not assign group.",
    };
  }
  return event;
};
