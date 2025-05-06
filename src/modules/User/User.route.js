const express = require('express');
const UserController = require('./User.controller.js');
const validator = require('./User.validatory.js');
const { errHandle } = require('../../helpers/constants/handleError.js');
const  verifyToken  = require('../../common/middlewares/verifyToken.js');
const userRouter = express.Router();

const userController = new UserController();

// Define routes using controller methods
/**
 * @swagger
 * /api/v1/user/getAll:
 *   get:
 *     summary: Get paginated list of users
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of users per page
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         description: Filter users by name
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter users by email
 *     responses:
 *       200:
 *         description: A successful response with paginated user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 list:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       roleId:
 *                         type: string
 *                 pageMeta:
 *                   type: object
 *                   properties:
 *                     size:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

userRouter.get('/getAll', [verifyToken],errHandle(userController.getAll));

userRouter.post('/create', [validator.userCreateInput], userController.create);
/**
 * @swagger
 * /api/v1/user/login:
 *   post:
 *     summary: Login user and return authentication token
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/LoginInput'
 *               - $ref: '#/components/schemas/EncryptedLoginInput'
 *           examples:
 *             RegularPayload:
 *               summary: Regular login payload
 *               value:
 *                 email: "admin@gmail.com"
 *                 password: "Admin@123"
 *             EncryptedPayload:
 *               summary: Encrypted login input
 *               value:
 *                 input: "U2FsdGVkX1/abcdEncryptedStringHereXYZ=="
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *             example:
 *               statusCode: 200
 *               message: "Success"
 *               data:
 *                 token: "jwt-token-string-here"
 *                 user:
 *                   name: "Test User"
 *                   id: "661f123abdf65c0012345678"
 *                   permissions: ["CREATE_ORDER", "VIEW_ORDER"]
 *       400:
 *         description: Bad Request - Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: 400
 *               message: "Bad Request"
 *               data:
 *                 - message: "\"email\" is required"
 *                   path: ["email"]
 *                   type: "any.required"
 *                   context:
 *                     label: "email"
 *                     key: "email"
 *       401:
 *         description: Unauthorized - Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: 401
 *               message: "Invalid credentials"
 *               data: null
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: 500
 *               message: "Internal server error"
 *               data: null
 * components:
 *   schemas:
 *     LoginInput:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "testuser@example.com"
 *         password:
 *           type: string
 *           example: "Password@123"
 *   
 *     EncryptedLoginInput:
 *       type: object
 *       required: [input]
 *       properties:
 *         input:
 *           type: string
 *           description: Encrypted or base64-encoded login payload
 *           example: "U2FsdGVkX1/abcdEncryptedStringHereXYZ=="
 * 
 *     LoginResponse:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: number
 *           example: 200
 *         message:
 *           type: string
 *           example: "Success"
 *         data:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               description: JWT token
 *               example: "jwt-token-string-here"
 *             user:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "Test User"
 *                 id:
 *                   type: string
 *                   description: MongoDB ObjectId
 *                   example: "661f123abdf65c0012345678"
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["CREATE_ORDER", "VIEW_ORDER"]
 * 
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           description: HTTP status code
 *           example: 400
 *         message:
 *           type: string
 *           description: Error message
 *           example: "Bad Request"
 *         data:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "\"email\" is required"
 *               path:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["email"]
 *               type:
 *                 type: string
 *                 example: "any.required"
 *               context:
 *                 type: object
 *                 properties:
 *                   label:
 *                     type: string
 *                     example: "email"
 *                   key:
 *                     type: string
 *                     example: "email"
 */

userRouter.post('/login', [validator.loginInputValidation],errHandle(userController.login));
module.exports = userRouter;