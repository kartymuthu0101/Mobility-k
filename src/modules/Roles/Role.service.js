const BaseService = require("../../common/BaseService.js");
const Role = require("./Role.model.js");

class RoleService extends BaseService {
    constructor() {
        super(Role);
    }
    
    async findByName(name) {
        try {
            return await this.model.findOne({
                where: { name }
            });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = RoleService;