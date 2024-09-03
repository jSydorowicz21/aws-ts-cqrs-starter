import { ItemPriceUpdatedEvent } from "../models/commandModels";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { createDynamoDBClient } from "../config/dynamoDB";

const client = createDynamoDBClient();
const TABLE_NAME = process.env.ITEM_PRICE_TABLE_NAME;

export const handler = async (event: ItemPriceUpdatedEvent) => {
    const command = new PutItemCommand({
        TableName: TABLE_NAME,
        Item: {
            id: { S: event.id },
            price: { N: event.price.toString()},
            timestamp: { S: event.timestamp},
        },
    });
    try {
        const response = await client.send(command);
        if (response.$metadata.httpStatusCode === 200) {
            return event;
        }
        throw new Error("Failed to update item price");
    } catch (error) {
        console.error(error);
        throw new Error("Failed to update item price");
    }
}
