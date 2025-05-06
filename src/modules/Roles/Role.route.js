const express = require('express');
const RoleController = require('./Role.controller.js');
const validator = require('./Role.validator.js');
const { errHandle } = require('../../helpers/constants/handleError.js');
const  verifyToken  = require('../../common/middlewares/verifyToken.js');
const RoleRouter = express.Router();

const roleController = new RoleController();

// Define routes using controller methods

/**
 * @swagger
 * /api/v1/role/getAll:
 *   get:
 *     summary: Get all roles with optional filters and pagination
 *     tags:
 *       - Roles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for name or description (partial match)
 *       - in: query
 *         name: status
 *         schema:
 *           type: boolean
 *         description: Filter by active (true) or inactive (false) status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Successfully retrieved all roles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Roles retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     roles:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Role'
 *                     total:
 *                       type: integer
 *                       example: 50
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *       400:
 *         description: Bad request due to invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

RoleRouter.get('/getAll', [verifyToken] ,errHandle(roleController.getAll));

/**
 * @swagger
 * /api/v1/role/create:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/RoleInput'
 *               - $ref: '#/components/schemas/EncryptedRoleInput'
 *           examples:
 *             RegularPayload:
 *               summary: Regular payload to create a role
 *               value:
 *                 name: "Admin"
 *                 description: "Administrator role with full access"
 *                 permissions: ["create", "edit", "delete", "view"]
 *             EncryptedPayload:
 *               summary: Encrypted role input
 *               value:
 *                 input: "U2FsdGVkX1/abcdEncryptedStringHereXYZ=="
 *     responses:
 *       201:
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleResponse'
 *             example:
 *               statusCode: 201
 *               message: "Role created successfully"
 *               data:
 *                 _id: "60af8841d3e2f8a9c4567e13"
 *                 name: "Admin3"
 *                 description: "Administrator role with full access"
 *                 permissions: ["create", "edit", "delete", "view"]
 *                 status: true
 *                 isDeleted: false
 *       400:
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: 400
 *               message: "Bad Request"
 *               data:
 *                 - message: "\"name\" is required"
 *                   path: ["name"]
 *                   type: "any.required"
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: 401
 *               message: "Unauthorized"
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
 *
 * components:
 *   schemas:
 *     RoleInput:
 *       type: object
 *       required:
 *         - name
 *         - description
 *       properties:
 *         name:
 *           type: string
 *           minLength: 3
 *           maxLength: 50
 *           example: "Admin"
 *         description:
 *           type: string
 *           minLength: 6
 *           example: "Administrator role with full access"
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *           example: ["create", "edit", "delete", "view"]
 *     EncryptedRoleInput:
 *       type: object
 *       required:
 *         - input
 *       properties:
 *         input:
 *           type: string
 *           description: Encrypted or base64-encoded role input
 *           example: "U2FsdGVkX1/abcdEncryptedStringHereXYZ=="
 *     RoleResponse:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: number
 *           example: 201
 *         message:
 *           type: string
 *           example: "Role created successfully"
 *         data:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: "60af8841d3e2f8a9c4567e13"
 *             name:
 *               type: string
 *               example: "Admin"
 *             description:
 *               type: string
 *               example: "Administrator role with full access"
 *             permissions:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["create", "edit", "delete", "view"]
 *             status:
 *               type: boolean
 *               example: true
 *             isDeleted:
 *               type: boolean
 *               example: false
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
 *                 example: "\"name\" is required"
 *               path:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["name"]
 *               type:
 *                 type: string
 *                 example: "any.required"
 *               context:
 *                 type: object
 *                 properties:
 *                   label:
 *                     type: string
 *                     example: "name"
 *                   key:
 *                     type: string
 *                     example: "name"
 *
 * securitySchemes:
 *   bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT
 */

RoleRouter.post('/create', [verifyToken, validator.roleCreateInput], errHandle(roleController.create));

/**
 * @swagger
 * /api/v1/role/getById/{id}:
 *   get:
 *     summary: Retrieve a role by ID
 *     tags:
 *       - Roles
 *     security:
 *       - bearerAuth: []  # Token-based authentication
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the role to retrieve
 *         required: true
 *         schema:
 *           type: string
 *           example: "68d5e329-d9bb-4393-b919-8683df04a6a5"
 *     responses:
 *       200:
 *         description: Role retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Role found
 *                 data:
 *                   $ref: '#/components/schemas/Role'
 *       400:
 *         description: Bad Request - Invalid ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: 400
 *               message: Invalid ID format
 *               data: null
 *       404:
 *         description: Role not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: 404
 *               message: Role not found
 *               data: null
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: 500
 *               message: Internal server error
 *               data: null
 *
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "68d5e329-d9bb-4393-b919-8683df04a6a5"
 *         name:
 *           type: string
 *           example: "Admin"
 *         description:
 *           type: string
 *           example: "Administrator role with full access"
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *           example: ["create", "read", "update", "delete"]
 *         status:
 *           type: boolean
 *           example: true
 *         isDeleted:
 *           type: boolean
 *           example: false
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           example: 400
 *         message:
 *           type: string
 *           example: Invalid ID format
 *         data:
 *           nullable: true
 */

RoleRouter.get('/getById/:id', [verifyToken],errHandle(roleController.getById));

/**
 * @swagger
 * /api/v1/role/update/{id}:
 *   put:
 *     summary: Update a role by ID
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []   # Assuming token is required for authorization
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the role to update
 *         required: true
 *         schema:
 *           type: string
 *           example: "b9210605-910d-4149-9293-664a4a6c47c6"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *                 example: "Admin1"
 *               description:
 *                 type: string
 *                 minLength: 6
 *                 example: "Updated description of the admin role"
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["read", "update"]
 *     responses:
 *       200:
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleResponse'
 *             example:
 *               statusCode: 200
 *               message: "Role updated"
 *               data:
 *                 id: "68d5e329-d9bb-4393-b919-8683df04a6a5"
 *                 name: "Admin"
 *                 description: "Updated description of the admin role"
 *                 permissions: ["read", "update"]
 *                 status: true
 *       400:
 *         description: Bad Request - Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: 400
 *               message: "Validation error"
 *               data: null
 *       404:
 *         description: Role not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: 404
 *               message: "Role not found"
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
 *     RoleResponse:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: number
 *           example: 200
 *         message:
 *           type: string
 *           example: "Role updated"
 *         data:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: "60af8841d3e2f8a9c4567e13"
 *             name:
 *               type: string
 *               example: "Admin"
 *             description:
 *               type: string
 *               example: "Updated description of the admin role"
 *             permissions:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["read", "update"]
 *             status:
 *               type: boolean
 *               example: true
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           description: HTTP status code
 *           example: 400
 *         message:
 *           type: string
 *           description: Error summary
 *           example: "Validation error"
 *         data:
 *           type: null
 */
RoleRouter.put('/update/:id', [verifyToken,validator.roleUpdateInput], errHandle(roleController.update));

/**
 * @swagger
 * /api/v1/role/delete/{id}:
 *   delete:
 *     summary: Delete a role by ID
 *     tags:
 *       - Roles
 *     security:
 *       - bearerAuth: []  # JWT token for authorization
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: MongoDB ObjectId of the role to delete
 *         schema:
 *           type: string
 *           example: "68d5e329-d9bb-4393-b919-8683df04a6a5"
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Role deleted successfully
 *                 data:
 *                   type: null
 *       404:
 *         description: Role not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: 404
 *               message: Role not found
 *               data: null
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: 500
 *               message: Internal server error
 *               data: null
 *
 * components:
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           example: 400
 *         message:
 *           type: string
 *           example: Role not found
 *         data:
 *           nullable: true
 */

RoleRouter.delete('/delete/:id', [verifyToken],errHandle(roleController.delete));

module.exports = RoleRouter;