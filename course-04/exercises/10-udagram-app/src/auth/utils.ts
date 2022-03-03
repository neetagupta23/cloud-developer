import { decode } from 'jsonwebtoken'
import { JwtToken } from './JwtToken'

export function getUserid(JwtToken: string): string{
    const decodedJwt= decode(JwtToken) as JwtToken
    return decodedJwt.sub
}