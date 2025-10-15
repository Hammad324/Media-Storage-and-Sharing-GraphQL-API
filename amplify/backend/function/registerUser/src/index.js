const {
  CognitoIdentityProviderClient,
  SignUpCommand,
} = require("@aws-sdk/client-cognito-identity-provider");

const cognito = new CognitoIdentityProviderClient({
  region: process.env.REGION || "us-east-1",
});

exports.handler = async (event) => {
  try {
    console.log("Incoming event:", JSON.stringify(event, null, 2));

    const { username, password, email } = event.arguments.input;

    if ([username, password, email].some((item) => item?.trim() === "")) {
      return { success: false, message: "All fields are required" };
    }

    const signUp = new SignUpCommand({
      ClientId: process.env.CLIENT_ID,
      Username: email, // login with email
      Password: password,
      UserAttributes: [
        { Name: "email", Value: email }, 
        { Name: "preferred_username", Value: username }
      ],
    });

    await cognito.send(signUp);

    return {
      success: true,
      message: `User ${username} registered successfully`,
    };
  } catch (err) {
    console.error("Error in register:", err);
    return { success: false, message: err.message || "Registration failed" };
  }
};