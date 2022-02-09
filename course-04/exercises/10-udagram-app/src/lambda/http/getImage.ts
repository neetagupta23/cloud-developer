import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda' 


import 'source-map-support/register'
import * as AWS from 'aws-sdk'

const docClient =new AWS.DynamoDB.DocumentClient()
const imagesTable= process.env.IMAGES_TABLE
const imageIdIndex = process.env.IMAGE_ID_INDEX

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    console.log('Caller event:', event)
    
    const imageId = event.pathParameters.imageId 
   
   /* const validGroupId = await groupExists(groupId)

    if(!validGroupId){
        return{
         statusCode: 404,
        headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Group does not exist'
            })
        }
    } 

    const images = await getImagesPerGroup(groupId) */
    /*const result = await docClient.scan({
        TableName: groupsTable
    }).promise()

    const items = result.Items*/

    const result = await docClient.query({
        TableName: imagesTable,
        IndexName: imageIdIndex,
        KeyConditionExpression: 'imageId = :imageId',
        ExpressionAttributeValues: {
          ':imageId': imageId
        }
    }).promise()

    if( result.Count !==0)
    {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(result.Items[0])
        }
    }
   return {
        statusCode: 401,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        body: ''
    }
}
