const BaseService = require("../../common/BaseService.js");
const RoleModel = require("./Role.model.js");

class RoleService extends BaseService {
    constructor() {
        super(RoleModel);
    }
    async findByName(name) {
        try {
            return await this.model.findOne({ name });
        } catch (error) {
            throw error;
        }
    }
  
}

module.exports = RoleService;