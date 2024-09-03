import { APIGatewayProxyHandler } from "aws-lambda";
import { queryService } from "../services/queryService";
import { Item } from "../models/queryModels";

export const handler: APIGatewayProxyHandler = async (event, context) => {
    const items: Item[] = await queryService.listItems();

    if (!items) {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: "Items not found" }),
        };
    }
    
    return {
        statusCode: 200,
        body: JSON.stringify(items),
    }
}