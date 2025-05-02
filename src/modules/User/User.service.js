const BaseService = require("../../common/BaseService.js");
const UserModel = require("./User.model.js");

class UserService extends BaseService {
    constructor() {
        super(UserModel);
    }

    async findByEmail(email) {
        return this.model.findOne({ email }).populate('roleId');
    }
}

module.exports = UserService;