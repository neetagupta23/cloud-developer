import { CustomAuthorizerEvent, CustomAuthorizerResult } from "aws-lambda";
import 'source-map-support/register'

import {verify} from 'jsonwebtoken'
import { JwtToken } from "../../auth/JwtToken";

import * as middy from 'middy'

import { secretsManager } from 'middy/middlewares'

const secretId= process.env.AUTH_0_SECRET_ID
const secretField= process.env.AUTH_0_SECRET_FIELD


export const handler = middy( async ( event:CustomAuthorizerEvent, context): Promise<CustomAuthorizerResult>=>
{
  try
  {
    const decodeToken= verifyToken(event.authorizationToken, context.AUTH0_SECRET[secretField])
    console.log('User was authorized',decodeToken)

    return {
        principalId: decodeToken.sub,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: 'Allow',
                    Resource: '*'
                }
            ]
        }
    }

  }
  catch(e)
  {
    console.log('User was not authorized', e.message)
    return{
        principalId: 'user',
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: 'Deny',
                    Resource: '*'
                }
            ]
        }
    }
  }
})

 function verifyToken(authHeader: string, secret: string): JwtToken{
    if(!authHeader)
        throw new Error('No authorization header')

    if(!authHeader.toLowerCase().startsWith('bearer '))
     throw new Error('Invalid authorization header')
     
     const split = authHeader.split('')
     const token = split[1]

     /*const secretObject: any = await getSecret()
     const secret= secretObject[secretField]*/
    
     return verify(token, secret) as JwtToken
     

}

/*async function getSecret(){
    if(cachedSecret) return cachedSecret

    const data= await client.getSecretValue({
        SecretId: secretId
    }).promise()

    cachedSecret= data.SecretString

    return JSON.parse(cachedSecret)
}*/
 handler.use(
     secretsManager(
         {
             cache: true,
             cacheExpiryInMillis: 60000,
             throwOnFailedCall:true,
             secrets:{
                 AUTH0_SECRET: secretId
             }
         }
     )
 )