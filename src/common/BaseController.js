const { sendResponse } = require("../helpers/response.js");

class BaseController {

    success;
    error;
    constructor() {
        this.sendResponse = sendResponse;
    }
}

module.exports = BaseController;