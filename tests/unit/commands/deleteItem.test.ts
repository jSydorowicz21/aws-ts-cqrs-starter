import { handler } from "../../../src/commands/deleteItem";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context, Callback } from "aws-lambda";
import { commandService } from "../../../src/services/commandService";

jest.mock("../../../src/services/commandService");
    
describe("deleteItem", () => {
    it("should delete an item", async () => {
        const mockItem = {
            id: "123",
            name: "Test Item",
            price: 10,
            description: "This is a test item",
            createdAt: "2024-02-14T12:00:00Z",
            updatedAt: "2024-02-14T12:00:00Z"
        };

        (commandService.deleteItem as jest.Mock).mockResolvedValue(mockItem.id);

        const event: APIGatewayProxyEvent = {
            pathParameters: { id: "123" },
        } as unknown as APIGatewayProxyEvent;

        const result = await handler(event, {} as Context, {} as Callback) as APIGatewayProxyResult;

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toEqual(mockItem.id);
        expect(commandService.deleteItem).toHaveBeenCalledWith(mockItem.id);
    });

    it("should return 400 for invalid request parameters", async () => {
        const event: APIGatewayProxyEvent = {
            pathParameters: null,
        } as unknown as APIGatewayProxyEvent;

        const result = await handler(event, {} as Context, {} as Callback) as APIGatewayProxyResult;

        expect(result.statusCode).toBe(400);
        expect(JSON.parse(result.body)).toEqual({ message: "Invalid request parameters" });
    });

    it("should return 500 if item deletion fails", async () => {
        (commandService.deleteItem as jest.Mock).mockResolvedValue(null);

        const event: APIGatewayProxyEvent = {
            pathParameters: { id: "123" },
        } as unknown as APIGatewayProxyEvent;

        const result = await handler(event, {} as Context, {} as Callback) as APIGatewayProxyResult;

        expect(result.statusCode).toBe(500);
        expect(JSON.parse(result.body)).toEqual({ message: "Failed to delete item" });
    });
});