import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { ItemPrice } from "../models/queryModels";

const client = new DynamoDBClient({});
const PRICE_TABLE_NAME = process.env.PRICE_TABLE_NAME;

export const priceQueryService = {
    getLatestPrice: async (id: string): Promise<ItemPrice | null> => {
        const command = new QueryCommand({
            TableName: PRICE_TABLE_NAME,
            KeyConditionExpression: "id = :id",
            ExpressionAttributeValues: {
              ":id": { S: id },
            },
            ScanIndexForward: false,
            Limit: 1,
        });
    
        try {
            const response = await client.send(command);
            if (response.Items && response.Items.length > 0) {
              return unmarshall(response.Items[0]) as ItemPrice;
            }
            return null;
        } catch (error) {
            console.error("Error getting latest price:", error);
            throw error;
        }
    },
};