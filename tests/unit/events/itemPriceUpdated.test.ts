import { handler } from "../../../src/events/itemPriceUpdated";
import { ItemPriceUpdatedEvent } from "../../../src/models/commandModels";
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

jest.mock('@aws-sdk/client-dynamodb');

const mockDynamoDBClient = DynamoDBClient as jest.MockedClass<typeof DynamoDBClient>;
const mockSend = jest.fn();

describe("itemPriceUpdated handler", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.ITEM_PRICE_TABLE_NAME = 'test-price-table';
        mockDynamoDBClient.prototype.send = mockSend;
    });

    it("should update the price of an item", async () => {
        const event: ItemPriceUpdatedEvent = {
            id: 'test-item-id',
            price: 10.99,
            timestamp: '2023-04-01T12:00:00Z',
        };

        mockSend.mockResolvedValueOnce({ 
            $metadata: { httpStatusCode: 200 }
        });

        const result = await handler(event);

        expect(mockSend).toHaveBeenCalledTimes(1);
        expect(mockSend).toHaveBeenCalledWith(expect.any(PutItemCommand));

        expect(result).toMatchObject(event);
    });

    it("should throw an error if the item price update fails", async () => {
        const event: ItemPriceUpdatedEvent = {
            id: 'test-item-id',
            price: 10.99,
            timestamp: '2023-04-01T12:00:00Z',
        };

        mockSend.mockResolvedValueOnce({ 
            $metadata: { httpStatusCode: 500 }
        });

        await expect(handler(event)).rejects.toThrow('Failed to update item price');
    });
});