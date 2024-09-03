import { APIGatewayProxyHandler } from "aws-lambda";
import { queryService } from "../services/queryService";
import { Item } from "../models/queryModels";

export const handler: APIGatewayProxyHandler = async (event, context) => {
    if (!event.pathParameters) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Invalid request parameters" }),
        };
    }

    const { id } = event.pathParameters as { id: string };
    const item: Item | null = await queryService.getItem(id) as Item | null;

    if (!item) {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: "Item not found" }),
        };
    }
    
    return {
        statusCode: 200,
        body: JSON.stringify(item),
    };
}
