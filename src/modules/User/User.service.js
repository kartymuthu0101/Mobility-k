const BaseService = require("../../common/BaseService.js");
const User = require("./User.model.js");
const Role = require("../Roles/Role.model.js");

class UserService extends BaseService {
    constructor() {
        super(User);
    }

    async findByEmail(email) {
        return this.model.findOne({
            where: { email },
            include: [{
                model: Role,
                as: 'role'
            }]
        });
    }
}

module.exports = UserService;