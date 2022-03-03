import 'source-map-support/register';
import { verify } from 'jsonwebtoken';
const cert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJNWP2R5LRs9IPMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi1veW9jcXF4OC5qcC5hdXRoMC5jb20wHhcNMjIwMjI4MTA0OTI3WhcN
MzUxMTA3MTA0OTI3WjAkMSIwIAYDVQQDExlkZXYtb3lvY3FxeDguanAuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtOWAG+XZKElSS7A7
aDWUEBJHaX+IMQfREryz905Rf5Qcm+CnVW+13fj/KzUAvn83KYnW+0/0Id40l0Ld
HV/iBigwUW1yDNfx1ViYpzBRcVpRxrG324t/9t7fI5Mx3RScDCC5BCaCAeBJ8dIG
Blu9DCtIkSH4w1OS5BS3PMghx2uDvPeySSby7QyT4y9+wzNU8PSsYJWn8QLeSOIZ
KzS4bhWypuaqfr0Ua35w2tiLGWHfH/Oog3beU8oRJr5cRvEy0qe8NZizQU9CtNGG
bj3AnQfTAoGPKjHwYQQfLoW7HYVt9JbKLI3bxGW/V4aVeSY+6MO8+KpbCNSRvU7t
iDhNSQIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBTl7ZAOzN//
A6Lozws26WrLoohA9zAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AHGZGF9Ufw4DHjwR7D4kBVcoO5vWlX/igI2oK9qP7KWMr/xzyhzgyCfPVxDk3PSc
whGx4xzrO+86f+KuHu2UMCgD55oRpunTslnhXaLl12a0JpY4Tdeyf0A5vtzWTNSj
JTM6DVHzhJPEh0Kplf1OAuc911cpDy6kc4mCyqg5LcMnNlvhNUe1stegGS0yqo3Y
feCImiMm5j3+owFtny63erruw7a5YaDSpilIKY1DS254s4mm5ZkrLpkaUm/YegXK
piE+cIF0E9JEdJd1FrGRLXyQEHZMTCZaRzX0WRYlVVmc07e1F5d8osSSp7cOn4H4
JBoKAV0EKltcF8yLeMvnQDo=
-----END CERTIFICATE-----`;
export const handler = async (event) => {
    try {
        const JwtToken = verifyToken(event.authorizationToken);
        console.log('User was authorized', JwtToken);
        return {
            principalId: JwtToken.sub,
            policyDocument: {
                Version: '2012-1-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Allow',
                        Resource: '*'
                    }
                ]
            }
        };
    }
    catch (error) {
        console.log('User authorized', error.message);
        return {
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
        };
    }
};
function verifyToken(authHeader) {
    if (!authHeader)
        throw new Error("No authentication header");
    if (!authHeader.toLocaleLowerCase().startsWith('bearer '))
        throw new Error('Invalid authentication header');
    const split = authHeader.split('');
    const token = split[1];
    return verify(token, cert, { algorithms: ['RS256'] });
}
//# sourceMappingURL=rs256Auth0Authorizer.js.map