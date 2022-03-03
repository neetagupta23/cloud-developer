import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import 'source-map-support/register'
import * as AWS from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()

const connectionsTable= process.env.CONNECTIONS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult> =>{
    
    const connectionId= event.requestContext.connectionId
    const timesstamp= new Date().toISOString()
    const item = {
        id: connectionId,
        timesstamp
    }
    await docClient.put({
        TableName: connectionsTable,
        Item: item
    }).promise()

    return{
        statusCode: 200,
        body:' '
    }

}