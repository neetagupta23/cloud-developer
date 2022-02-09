import 'source-map-support/register';
import * as AWS from 'aws-sdk';
const docClient = new AWS.DynamoDB.DocumentClient();
const groupsTable = process.env.GROUPS_TABLE;
export async function handler(event) {
    console.log('Processing event:', event);
    const result = await docClient.scan({
        TableName: groupsTable
    }).promise();
    const items = result.Items;
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            items
        })
    };
}
//# sourceMappingURL=getGroups.js.map