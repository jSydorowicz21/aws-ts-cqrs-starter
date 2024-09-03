import { APIGatewayProxyHandler } from "aws-lambda";
import { commandService } from "../services/commandService";
import { UpdateItemInput, Item } from "../models/commandModels";

export const handler: APIGatewayProxyHandler = async (event) => {
    if (!event.pathParameters || !event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Invalid request parameters or body" }),
        };
    }

    const { id } = event.pathParameters as { id: string };
    const updateItemInput : UpdateItemInput = JSON.parse(event.body);
    const updatedItem: Item | null = await commandService.updateItem(id, updateItemInput) as Item | null;

    if (!updatedItem) {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: "Item not found" }),
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify(updatedItem),
    }
}