import { handler } from "../../../src/queries/getItem";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context, Callback } from "aws-lambda";
import { queryService } from "../../../src/services/queryService";

jest.mock("../../../src/services/queryService");
    
describe("getItem", () => {
    it("should get an item", async () => {
        const mockItem = {
            id: "123",
            name: "Test Item",
            price: 10,
            description: "This is a test item",
        };

        (queryService.getItem as jest.Mock).mockResolvedValue(mockItem);

        const event: APIGatewayProxyEvent = {
            pathParameters: { id: "123" },
        } as unknown as APIGatewayProxyEvent;

        const result = await handler(event, {} as Context, {} as Callback) as APIGatewayProxyResult;

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toEqual(mockItem);
        expect(queryService.getItem).toHaveBeenCalledWith("123");
    });

    it("should return 404 for no items", async () => {
        const event: APIGatewayProxyEvent = {
            pathParameters: { id: "123" },
        } as unknown as APIGatewayProxyEvent;

        (queryService.getItem as jest.Mock).mockResolvedValue(null); 

        const result = await handler(event, {} as Context, {} as Callback) as APIGatewayProxyResult;
        expect(result.statusCode).toBe(404);
        expect(JSON.parse(result.body)).toEqual({ message: "Item not found" });
    });

    it("should return 400 for invalid request parameters", async () => {
        const event: APIGatewayProxyEvent = {
            pathParameters: null,
        } as unknown as APIGatewayProxyEvent;

        const result = await handler(event, {} as Context, {} as Callback) as APIGatewayProxyResult;
        expect(result.statusCode).toBe(400);
        expect(JSON.parse(result.body)).toEqual({ message: "Invalid request parameters" });
    });
});
