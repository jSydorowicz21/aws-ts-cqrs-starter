import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
    service: "aws-ts-starter",
    frameworkVersion: "3",
    provider: {
        name: "aws",
        runtime: "nodejs18.x",
        region: "us-east-1",
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
            NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
            TABLE_NAME: "${self:service}-${opt:stage, self:provider.stage}-items",
            ITEM_PRICE_TABLE_NAME: "${self:service}-${opt:stage, self:provider.stage}-item-prices",
            ITEM_PRICE_UPDATED_FUNCTION: "${self:service}-${opt:stage, self:provider.stage}-itemPriceUpdated",
        },
        iam: {
            role: {
              statements: [
                {
                  Effect: "Allow",
                  Action: [
                    "dynamodb:PutItem",
                    "dynamodb:GetItem",
                    "dynamodb:UpdateItem",
                    "dynamodb:DeleteItem",
                    "dynamodb:Scan",
                    "dynamodb:Query",
                    "lambda:InvokeFunction"
                  ],
                  Resource: "arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.TABLE_NAME},arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.ITEM_PRICE_TABLE_NAME}"
                }
              ]
            }
        },
    },
    resources: {
        Resources: {
            ItemsTable: {
              Type: "AWS::DynamoDB::Table",
              Properties: {
                TableName: "${self:provider.environment.TABLE_NAME}",
                AttributeDefinitions: [
                  {
                    AttributeName: "id",
                    AttributeType: "S",
                  },
                ],
                KeySchema: [
                  {
                    AttributeName: "id",
                    KeyType: "HASH",
                  },
                ],
                BillingMode: "PAY_PER_REQUEST",
              },
            },
            ItemPricesTable: {
              Type: "AWS::DynamoDB::Table",
              Properties: {
                TableName: "${self:provider.environment.ITEM_PRICE_TABLE_NAME}",
                AttributeDefinitions: [
                  {
                    AttributeName: "id",
                    AttributeType: "S",
                  },
                ],
                KeySchema: [
                  {
                    AttributeName: "id",
                    KeyType: "HASH",
                  },
                ],
                BillingMode: "PAY_PER_REQUEST",
              },
            },
        },
    },
    functions: {
        itemPriceUpdated: {
            handler: "src/events/itemPriceUpdated.handler",
            events: [],
        },
        createItem: {
            handler: "src/commands/createItem.handler",
            events: [
                {
                    http: {
                        method: "post",
                        path: "/items",
                    }
                }
            ]
        },
        getItem: {
            handler: "src/queries/getItem.handler",
            events: [
                {
                    http: {
                        method: "get",
                        path: "/items/{id}"
                    }
                }
            ]
        },
        updateItem: {
            handler: "src/commands/updateItem.handler",
            events: [
                {
                    http: {
                        method: "put",
                        path: "/items/{id}"
                    }
                }
            ]
        },
        deleteItem: {
            handler: "src/commands/deleteItem.handler",
            events: [
                {
                    http: {
                        method: "delete",
                        path: "/items/{id}"
                    }
                }
            ]
        },
        listItems: {
            handler: "src/queries/listItems.handler",
            events: [
                {
                    http: {
                        method: "get",
                        path: "/items"
                    }
                }
            ]
        },
    },
    package: {
        individually: true,
        exclude: ["node_modules/**", "README.md", "LICENSE", "package.json"],
    },
    custom: {
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ['aws-sdk'],
            target: 'node14',
            define: { 'require.resolve': undefined },
            platform: 'node',
            concurrency: 10,
        },
    },
    plugins: ['serverless-esbuild', 'serverless-offline'],
}

module.exports = serverlessConfiguration;