import { PutItemCommand, DeleteItemCommand, PutItemCommandOutput, DeleteItemCommandOutput } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { CreateItemInput, UpdateItemInput, ItemPriceUpdatedEvent } from "../models/commandModels";
import { createDynamoDBClient } from "../config/dynamoDB";
import { Lambda} from "@aws-sdk/client-lambda";
const client = createDynamoDBClient();
const lambda = new Lambda({
    ...(process.env.IS_OFFLINE === 'true' && {
        endpoint: process.env.LAMBDA_ENDPOINT || 'http://localhost:3002',
        credentials: {
            accessKeyId: 'DUMMYIDEXAMPLE',
            secretAccessKey: 'DUMMYEXAMPLEKEY'
        }
    })
});

export const TABLE_NAME = process.env.TABLE_NAME;

const emitPriceUpdatedEvent = async (id: string, price: number) => {
    const event: ItemPriceUpdatedEvent = {
        id,
        price,
        timestamp: new Date().toISOString(),
    };
    await lambda.invoke({
        FunctionName: process.env.ITEM_PRICE_UPDATED_FUNCTION,
        InvocationType: "Event",
        Payload: JSON.stringify(event),
    });
};

export const commandService = {
    createItem: async (itemInput: CreateItemInput) => {
        try {
            const command = new PutItemCommand({
                TableName: TABLE_NAME,
                Item: marshall(itemInput),
            });

            const response: PutItemCommandOutput = await client.send(command);
            if (response.$metadata.httpStatusCode === 200) {
                await emitPriceUpdatedEvent(itemInput.id, itemInput.price);
                return itemInput;
            }

            return null;
        } catch (error) {
            console.error("Error creating item:", error);
            throw error;
        }
    },

    updateItem: async (id: string, input: UpdateItemInput) => {
        try {
            const command = new PutItemCommand({
                TableName: TABLE_NAME,
                Item: marshall({ ...input, id }),
            });

            const response: PutItemCommandOutput = await client.send(command);
            if (response.$metadata.httpStatusCode === 200) {
                if (input.price !== undefined) {
                    await emitPriceUpdatedEvent(id, input.price);
                    return input;
                }
            }

            return null;
        } catch (error) {
            console.error("Error updating item:", error);
            throw error;
        }
    },

    deleteItem: async (id: string) => {
        try {
            const command = new DeleteItemCommand({
                TableName: TABLE_NAME,
                Key: marshall({ id }),
            });

            const response: DeleteItemCommandOutput = await client.send(command);
            if (response.$metadata.httpStatusCode === 200) {
                return { id };
            }

            return null;
        } catch (error) {
            console.error("Error deleting item:", error);
            throw error;
        }
    }
};