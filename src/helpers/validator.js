const statusCodes = require("./constants/httpStatusCodes.js")
const statusMsg = require("./constants/httpStatusMessage.js")
const { sendResponse } = require("./response.js")

const options = {
    // generic option
    basic: {
        abortEarly: false,
        convert: true,
        allowUnknown: false,
        stripUnknown: true,
    },
    // Options for Array of array
    array: {
        abortEarly: false,
        convert: true,
        allowUnknown: true,
        stripUnknown: {
            objects: true,
        },
    },
};

const bodyParamValidation = (req, res, next, schema) => {
    if (!req.body)
        return sendResponse(
            req,
            res,
            statusCodes.HTTP_BAD_REQUEST,
            statusMsg[400],
            "missing required inputs"
        );
    let option = options.basic;
    let { error } = schema.validate(req.body, option);

    if (error && Object.keys(error).length > 0) {
        sendResponse(
            req,
            res,
            statusCodes.HTTP_BAD_REQUEST,
            statusMsg[400],
            error?.details
        );
    } else {
        next();
    }
};

const queryParamValidation = (req, res, next, schema) => {
    if (!req.query)
        return sendResponse(
            req,
            res,
            statusCodes.HTTP_BAD_REQUEST,
            statusMsg[400],
            "missing required inputs"
        );

    let option = options.basic;
    let { error } = schema.validate(req.query, option);
    if (error && Object.keys(error).length > 0) {
        sendResponse(
            req,
            res,
            statusCodes.HTTP_BAD_REQUEST,
            statusMsg[400],
            error
        );
    } else {
        if (req.bodyParam) return;
        else next();
    }
};

module.exports = {
    bodyParamValidation,
    queryParamValidation
}