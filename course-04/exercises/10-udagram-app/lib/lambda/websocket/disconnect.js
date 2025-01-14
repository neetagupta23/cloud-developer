import 'source-map-support/register';
import * as AWS from 'aws-sdk';
const docClient = new AWS.DynamoDB.DocumentClient();
const connectionsTable = process.env.CONNECTIONS_TABLE;
export const handler = async (event) => {
    console.log('Websocket disconnect', event);
    const connectionId = event.requestContext.connectionId;
    const key = {
        id: connectionId
    };
    await docClient.delete({
        TableName: connectionsTable,
        Key: key
    }).promise();
    return {
        statusCode: 200,
        body: ' '
    };
};
//# sourceMappingURL=disconnect.js.map