const {CognitoJwtVerifier} = require('aws-jwt-verify');

const verifierCache = {}
async function verifyJwtTokens(token, clientId, userPoolId, tokenType = "access") {
    try {
    if (!verifierCache[tokenType]) {
      verifierCache[tokenType] = CognitoJwtVerifier.create({
        userPoolId,
        clientId,
        tokenUse: tokenType,
      });
    }

    const payload = await verifierCache[tokenType].verify(token);
    console.log(`${tokenType} token signature verified.`);
    return payload;
  } catch (error) {
    console.error("JWT verification failed:", error?.message || error);
    throw new Error("Signature is not valid or has been tampered.");
  }
}

module.exports = {verifyJwtTokens}