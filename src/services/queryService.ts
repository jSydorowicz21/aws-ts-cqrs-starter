import { DynamoDBClient, GetItemCommand, ScanCommand, GetItemCommandOutput, ScanCommandOutput } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { Item } from "../models/queryModels";
import { createDynamoDBClient } from "../config/dynamoDB";

const client = createDynamoDBClient();

export const TABLE_NAME = process.env.TABLE_NAME;

export const queryService = {
    getItem: async (id: string) => {
        try {
            const command = new GetItemCommand({
                TableName: TABLE_NAME,
                Key: marshall({ id }),
            });
            
            const response: GetItemCommandOutput = await client.send(command);
            return response.Item ? unmarshall(response.Item) as Item : null;
        } catch (error) {
            console.error("Error getting item:", error);
            throw error;
        }
    },
    listItems: async () => {
        try {
            const command = new ScanCommand({
                TableName: TABLE_NAME,
            });
            
            const response: ScanCommandOutput = await client.send(command);
            return response.Items?.map((item) => unmarshall(item)) as Item[];
        } catch (error) {
            console.error("Error listing items:", error);
            throw error;
        }
    },
};