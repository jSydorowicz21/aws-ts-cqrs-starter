import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuid } from "uuid";
import { commandService } from "../services/commandService";
import { CreateItemInput, Item} from "../models/commandModels";

export const handler: APIGatewayProxyHandler = async (event, context) => {
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Invalid request body" }),
        };
    }

    const id = uuid();
    const { name, price, description } = JSON.parse(event.body);
    const newItem : CreateItemInput = {
        id,
        name,
        price,
        description,
    }
    const itemReturn: Item | null = await commandService.createItem(newItem) as Item | null;

    if (!itemReturn) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to create item" }),
        };
    }

    return {
        statusCode: 201,
        body: JSON.stringify(itemReturn),
    }
}

