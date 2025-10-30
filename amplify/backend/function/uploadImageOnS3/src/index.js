const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");

const s3Client = new S3Client({ region: process.env.REGION || "us-east-1" });
const dynamoClient = new DynamoDBClient({
  region: process.env.REGION || "us-east-1",
});

exports.handler = async (event) => {
  try {
    console.log("Incoming event:", JSON.stringify(event, null, 2));

    const authHeader =
      event.request?.headers?.Authorization ||
      event.request?.headers?.authorization; // get auth header

    if (!authHeader)
      return {
        // check if missing, throw and error
        status: false,
        signedUrl: null,
        fileUrl: null,
        error: "Authorization header is missing.",
      };

    const decodeTokenId = jwt.decode(authHeader); // decode the tokenID

    const cognitoSubId = decodeTokenId.sub; // get the sub

    if (!cognitoSubId)
      return {
        // not possible but if no sub then throw error
        status: false,
        signedUrl: null,
        fileUrl: null,
        error: "Cognito Sub not found.",
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
        success: false,
        signedUrl: null,
        fileUrl: null,
        error: "Please log in to upload files.",
      };
    }

    const { filename, contentType } = event.arguments.input; // check the filename nad contenttype of the file.

    if (!filename || !contentType)
      return {
        uploadUrl: null,
        fileUrl: null,
        error: "Filename and content type both are required.",
      }; // if not throw and error

    const key = `profiles/${cognitoSubId}/${uuidv4()}-${filename}`; // create the key, where the file will be saved/uploaded

    const command = new PutObjectCommand({
      // creates blueprint object for s3 uploads.
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 }); // creates the signed url.

    const fileUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/${key}`;

    return { success: true, signedUrl, fileUrl, error: null };
  } catch (error) {
    console.log(`Error: ${error}`);
    return {
      success: false,
      signedUrl: null,
      fileUrl: null,
      error: error.message || "Error uploading the image on S3.",
    };
  }
};
