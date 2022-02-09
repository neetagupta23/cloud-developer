import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'

import * as AWS from 'aws-sdk'
import * as uuid from 'uuid'


const docClient =new AWS.DynamoDB.DocumentClient()
const groupsTable= process.env.GROUPS_TABLE
const imagesTable= process.env.IMAGES_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)

  const groupId = event.pathParameters.groupId 
 const validGroupId = await groupExists(groupId)

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

    const imageId = uuid.v4()

    const newItem= createImage(groupId,imageId,event)

   return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      newItem
 })
  }
}

async function groupExists(groupId: string) {
     const result = await docClient.get({
         TableName: groupsTable,
         Key: {
             Id: groupId
         }
     }).promise()

     console.log('Get group:', result)
     return !!result.Item

}
async function createImage(groupId: string, imageId: string, event: any) {
  const timesstamp= new Date().toISOString()
  const newImage= JSON.parse(event.body)

  const newItem={
    groupId,
    timesstamp,
    imageId,
    ...newImage
  }

  console.log('Storing new item:', newItem)

  await docClient.put({
   TableName: imagesTable,
   Item: newItem
 }).promise()

 return newItem

}

