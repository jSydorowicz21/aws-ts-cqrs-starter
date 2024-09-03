import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const isLocal = process.env.IS_OFFLINE === 'true' || process.env.NODE_ENV === 'development';

const dynamoDbClientParams = {
    region: isLocal ? "localhost" : (process.env.AWS_REGION || "us-east-1"),
    ...(isLocal && {
        endpoint: process.env.DYNAMODB_ENDPOINT || "http://dynamodb:8000",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || "DUMMYIDEXAMPLE",
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "DUMMYEXAMPLEKEY"
        }
    })
};

export function createDynamoDBClient() {
    return new DynamoDBClient(dynamoDbClientParams);
}
