const { environment } = require("../../config");
const { decrypt } = require("../../utils/encryption");

const decryptBody = async (req, res, next) => {
    try {
        if (req.body && typeof req.body?.input == 'string')
            req.body = await decrypt(req.body?.input)
        else if (!['development', 'staging'].includes(environment)) { }
        next();
    } catch (error) {
        console.error("Error in Decrypting BODY:", (error))
        next();
    }
}

module.exports = decryptBody;