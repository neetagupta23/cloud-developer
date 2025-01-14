import 'source-map-support/register';
import * as AWS from 'aws-sdk';
import * as uuid from 'uuid';
const docClient = new AWS.DynamoDB.DocumentClient();
const groupsTable = process.env.GROUPS_TABLE;
export const handler = async (event) => {
    console.log('Processing event: ', event);
    const itemId = uuid.v4();
    const parsedBody = JSON.parse(event.body);
    const newItem = Object.assign({ id: itemId }, parsedBody);
    await docClient.put({
        TableName: groupsTable,
        Item: newItem
    }).promise();
    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            newItem
        })
    };
};
//# sourceMappingURL=createGroups.js.map