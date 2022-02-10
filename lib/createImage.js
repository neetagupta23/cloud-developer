import 'source-map-support/register';
import * as AWS from 'aws-sdk';
import * as uuid from 'uuid';
const s3 = new AWS.S3({
    signatureVersion: 'v4'
});
const docClient = new AWS.DynamoDB.DocumentClient();
const groupsTable = process.env.GROUPS_TABLE;
const imagesTable = process.env.IMAGES_TABLE;
const bucketName = process.env.IMAGES_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;
export const handler = async (event) => {
    console.log('Processing event: ', event);
    const groupId = event.pathParameters.groupId;
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
    const imageId = uuid.v4();
    const newItem = createImage(groupId, imageId, event);
    const url = getUploadUrl(imageId);
    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            newItem,
            uploadUrl: url
        })
    };
};
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
async function createImage(groupId, imageId, event) {
    const timesstamp = new Date().toISOString();
    const newImage = JSON.parse(event.body);
    const newItem = Object.assign(Object.assign({ groupId,
        timesstamp,
        imageId }, newImage), { imageUrl: 'https://${bucketName}.s3.amazonaws.com/${imageId}' });
    console.log('Storing new item:', newItem);
    await docClient.put({
        TableName: imagesTable,
        Item: newItem
    }).promise();
    return newItem;
}
function getUploadUrl(imageId) {
    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: imageId,
        Expires: parseInt(urlExpiration)
    });
}
//# sourceMappingURL=createImage.js.map