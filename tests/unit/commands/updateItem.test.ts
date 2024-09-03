import { handler } from "../../../src/commands/updateItem";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context, Callback } from "aws-lambda";
import { commandService } from "../../../src/services/commandService";

jest.mock("../../../src/services/commandService");

describe("updateItem", () => {
    it("should update an item", async () => {
        const mockItem = {
            id: "123",
            name: "Test Item",
            price: 10,
            description: "This is a test item",
            createdAt: "2024-02-14T12:00:00Z",
            updatedAt: "2024-02-14T12:00:00Z"
        };

        (commandService.updateItem as jest.Mock).mockResolvedValue(mockItem);

        const event: APIGatewayProxyEvent = {
            body: JSON.stringify({ name: "Test Item", price: 10, description: "This is a test item" }),
            pathParameters: { id: "123" },
        } as unknown as APIGatewayProxyEvent;

        const result = await handler(event, {} as Context, {} as Callback) as APIGatewayProxyResult;

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toEqual(mockItem);
        expect(commandService.updateItem).toHaveBeenCalledWith("123",{
            name: "Test Item",
            price: 10,
            description: "This is a test item"
        });
    });

    it("should return 400 for invalid request body", async () => {
        const event: APIGatewayProxyEvent = {
            body: null,
        } as APIGatewayProxyEvent;

        const result = await handler(event, {} as Context, {} as Callback) as APIGatewayProxyResult;

        expect(result.statusCode).toBe(400);
        expect(JSON.parse(result.body)).toEqual({ message: "Invalid request parameters or body" });
    });

    it("should return 404 if item does not exist", async () => {
        (commandService.updateItem as jest.Mock).mockResolvedValue(null);

        const event: APIGatewayProxyEvent = {
            body: JSON.stringify({ name: "Test Item", price: 10, description: "This is a test item" }),
            pathParameters: { id: "123" },
        } as unknown as APIGatewayProxyEvent;

        (commandService.updateItem as jest.Mock).mockResolvedValue(null);
        const result = await handler(event, {} as Context, {} as Callback) as APIGatewayProxyResult;

        expect(result.statusCode).toBe(404);
        expect(JSON.parse(result.body)).toEqual({ message: "Item not found" });
    });
});