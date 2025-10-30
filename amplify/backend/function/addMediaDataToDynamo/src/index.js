const { DynamoDBClient, GetItemCommand, PutItemCommand, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");

const dynamoClient = new DynamoDBClient({ region: process.env.REGION || "us-east-1" });

exports.handler = async (event) => {
  console.log("Incoming S3 event:", JSON.stringify(event, null, 2));

  try {
    // incase we get multiple uplaod though the user is limited to one upload pe request for the timebeing.
    for (const record of event.Records) {
      const bucket = record.s3.bucket.name;
      const key = decodeURIComponent(record.s3.object.key.replaceAll("+", " "));
      const uploadedAt = new Date().toISOString();

      const keyParts = key.split("/");
      if (keyParts.length < 3 || keyParts[0] !== "profiles") {
        console.log("Skipping invalid key format:", key);
        continue;
      }

      const cognitoSubId = keyParts[1];
      const filename = keyParts[keyParts.length - 1];
      const fileUrl = `https://${bucket}.s3.${process.env.REGION}.amazonaws.com/${key}`;
      const contentType = key.split('.')[1];

      // Check if document exists
      const checkDocument = new GetItemCommand({
        TableName: process.env.DDB_TABLE,
        Key: { id: { S: cognitoSubId } },
      });

      const result = await dynamoClient.send(checkDocument);

      const fileMetadata = {
        M: {
          fileUrl: { S: fileUrl },
          contentType: { S: contentType },
          uploadedAt: { S: uploadedAt },
        },
      };

      if (result.Item) {
        // Append new filename field
        const updateDocument = new UpdateItemCommand({
          TableName: process.env.DDB_TABLE,
          Key: { id: { S: cognitoSubId } },
          UpdateExpression: `SET #filename = :metadata`,
          ExpressionAttributeNames: {
            "#filename": filename,
          },
          ExpressionAttributeValues: {
            ":metadata": fileMetadata,
          },
          ReturnValues: "UPDATED_NEW",
        });
        await dynamoClient.send(updateDocument);
        console.log(`Updated existing record for user ${cognitoSubId}`);
      } else {
        // Create new documentif it does not exist
        const CreateDocument = new PutItemCommand({
          TableName: process.env.DDB_TABLE,
          Item: {
            id: { S: cognitoSubId },
            [filename]: fileMetadata,
          },
        });
        await dynamoClient.send(CreateDocument);
        console.log(`Created new record for user ${cognitoSubId}`);
      }
    }

    return { status: "success" };
  } catch (error) {
    console.error("Error processing upload:", error);
    return { status: "error", message: error.message };
  }
};
