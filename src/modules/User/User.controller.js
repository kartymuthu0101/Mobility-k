
const BaseController = require("../../common/BaseController.js");
const statusCodes = require("../../helpers/constants/httpStatusCodes.js");
const statusMsg = require("../../helpers/constants/httpStatusMessage.js");
const UserService = require("./User.service.js");
const { paginate } = require("../../helpers/index.js");
const jwtUtils = require("../../utils/jwtAuth.js");

class UserController extends BaseController {
    userService;
    constructor() {
        super();
        this.userService = new UserService();
    }

    getAll = async (req, res) => {
        const { page = 1, limit = 10, ...filters } = req.query;
        const skip = (page - 1) * limit;

        const paginationPayload = { skip, limit, filters };
        const data = await this.userService.getPaginated(paginationPayload);

        this.sendResponse(
            req,
            res,
            statusCodes.HTTP_OK,
            statusMsg.HTTP_OK,
            paginate(data?.data, +page, +limit, data?.total)
        );
    };

    create = async (req, res) => {
        try {
            const data = await this.userService.create(req.body);
            this.sendResponse(
                req,
                res,
                statusCodes.HTTP_OK,
                statusMsg.HTTP_OK,
                data
            )
        } catch (error) {
            this.sendResponse(
                req,
                res,
                statusCodes.HTTP_INTERNAL_SERVER_ERROR,
                statusMsg[500],
                {},
                error
            )
        }
    }

   login = async (req, res) => {
    const { email, password } = req.body;

    const user = await this.userService.findByEmail(email);
    if (!user) {
        return this.sendResponse(
            req, 
            res, 
            statusCodes.HTTP_UNAUTHORIZED,
            "User not found", 
            {}
        );
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        return this.sendResponse(
            req, 
            res, 
            statusCodes.HTTP_UNAUTHORIZED, 
            "Invalid credentials", 
            {}
        );
    }

    const token = await jwtUtils.generateToken(user);

    this.sendResponse(
        req,
        res, 
        statusCodes.HTTP_OK, 
        statusMsg[200], {
        token,
        user: {
            name: user.username,
            id: user._id,
            permissions: user.roleId?.permissions || [],
        }
    });
};
    
}

module.exports = UserController;