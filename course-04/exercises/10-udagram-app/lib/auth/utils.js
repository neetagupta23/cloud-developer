import { decode } from 'jsonwebtoken';
export function getUserid(JwtToken) {
    const decodedJwt = decode(JwtToken);
    return decodedJwt.sub;
}
//# sourceMappingURL=utils.js.map