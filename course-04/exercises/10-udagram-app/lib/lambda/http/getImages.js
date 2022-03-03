import 'source-map-support/register';
import * as AWS from 'aws-sdk';
const docClient = new AWS.DynamoDB.DocumentClient();
const groupsTable = process.env.GROUPS_TABLE;
const imagesTable = process.env.IMAGES_TABLE;
export async function handler(event) {
    console.log('Processing event:', event);
    const groupId = event.pathParameters.groupId;
    console.log('Get groupId in Handler', groupId);
    const validGroupId = await groupExists(groupId);
    if (!validGroupId) {
        return {
            statusCode: 404,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Group does not exist'
            })
        };
    }
    const images = await getImagesPerGroup(groupId);
    /*const result = await docClient.scan({
        TableName: groupsTable
    }).promise()

    const items = result.Items*/
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
            items: images
        })
    };
}
async function groupExists(groupId) {
    const result = await docClient.get({
        TableName: groupsTable,
        Key: {
            Id: groupId
        }
    }).promise();
    console.log('Get group:', result);
    return !!result.Item;
}
async function getImagesPerGroup(groupId) {
    console.log('Inside getmagesPerGroup', groupId);
    const result = await docClient.query({
        TableName: imagesTable,
        KeyConditionExpression: 'groupId = :groupId',
        ExpressionAttributeValues: {
            ':groupId': groupId
        }
    }).promise();
    return result.Items;
}
//# sourceMappingURL=getImages.js.map