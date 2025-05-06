
const BaseController = require("../../common/BaseController.js");
const statusCodes = require("../../helpers/constants/httpStatusCodes.js");
const statusMsg = require("../../helpers/constants/httpStatusMessage.js");
const { paginate } = require("../../helpers/index.js");
const RoleService = require("./Role.service.js");

class RoleController extends BaseController {
    RoleService;
    constructor() {
        super();
        this.RoleService = new RoleService();
    }

    create = async (req, res) => {
        const data = await this.RoleService.create(req.body);
        this.sendResponse(
            req,
            res,
            statusCodes.HTTP_OK,
            statusMsg.HTTP_OK,
            data
        );
    };
    getAll = async (req, res) => {
        const { page = 1, limit = 10, ...filters } = req.query;
        const skip = (page - 1) * limit;

        const paginationPayload = { skip, limit, filters };
        const data = await this.RoleService.getPaginated(paginationPayload);

        this.sendResponse(
            req,
            res,
            statusCodes.HTTP_OK,
            statusMsg.HTTP_OK,
            paginate(data?.data, +page, +limit, data?.total)
        );
    };

    getById = async (req, res) => {
        const { id } = req.params;
        const data = await this.RoleService.getOne({ id: id });
        this.sendResponse(
            req,
            res,
            statusCodes.HTTP_OK,
            statusMsg.HTTP_OK,
            data
        );
    };
    update = async (req, res) => {
        const { id } = req.params;
        const data = await this.RoleService.update(id, 
        {
            ...req.body,
            isDeleted: false,
            deletedAt: null,
        }
    );
        this.sendResponse(
            req,
            res,
            statusCodes.HTTP_OK,
            statusMsg.HTTP_OK,
            data
        );
    };
    delete = async (req, res) => {
        const { id } = req.params;
        const data = await this.RoleService.delete(id);
        this.sendResponse(
            req,
            res,
            statusCodes.HTTP_OK,
            statusMsg.HTTP_OK,
            data
        );
    };


}
module.exports = RoleController;