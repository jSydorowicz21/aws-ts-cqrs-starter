import { handler } from "../../../src/commands/createItem";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context, Callback } from "aws-lambda";
import { commandService } from "../../../src/services/commandService";

jest.mock("../../../src/services/commandService");
    
describe("createItem", () => {
    it("should create an item", async () => {
        const mockItem = {
            name: "Test Item",
            price: 10,
            description: "This is a test item",
            createdAt: "2024-02-14T12:00:00Z",
            updatedAt: "2024-02-14T12:00:00Z"
        };

        (commandService.createItem as jest.Mock).mockResolvedValue(mockItem);

        const event: APIGatewayProxyEvent = {
            body: JSON.stringify({ name: "Test Item", price: 10, description: "This is a test item" }),
        } as APIGatewayProxyEvent;

        const result = await handler(event, {} as Context, {} as Callback) as APIGatewayProxyResult;
        
        expect(result.statusCode).toBe(201);
        expect(JSON.parse(result.body)).toEqual(mockItem);
        expect(commandService.createItem).toHaveBeenCalledWith({
            id: expect.any(String),
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
        expect(JSON.parse(result.body)).toEqual({ message: "Invalid request body" });
    });

    it("should return 500 if item creation fails", async () => {
        (commandService.createItem as jest.Mock).mockResolvedValue(null);

        const event: APIGatewayProxyEvent = {
            body: JSON.stringify({ name: "Test Item", price: 10, description: "This is a test item" }),
        } as APIGatewayProxyEvent;

        const result = await handler(event, {} as Context, {} as Callback) as APIGatewayProxyResult;

        expect(result.statusCode).toBe(500);
        expect(JSON.parse(result.body)).toEqual({ message: "Failed to create item" });
    });
});