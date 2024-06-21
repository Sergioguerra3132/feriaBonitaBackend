const express = require('express');
const router = express.Router();
const sysUserController = require('../controllers/sysUser.controller');
const {authenticateJWT, validateJWT} = require('../middlewares/authMiddleware'); // Assuming you have a middleware for JWT authentication
const sysuserSchemas = require('../joiSchemas/sysUser.schema');

/**
 * @swagger
 * /api/sysUser/getAllSysUsers:
 *   get:
 *     tags: [SysUser]
 *     summary: Get all sysUserss
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: sysUserss fetched successfully
 */
router.get('/getAllSysUsers', authenticateJWT, sysUserController.getAllSysUsers);

/**
 * @swagger
 * /api/sysUser/createUser:
 *   post:
 *     tags:
 *       - SysUser
 *     summary: Register a new system user
 *     requestBody:
 *       description: System user data to register
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - email
 *               - password
 *             properties:
 *               userName:
 *                 type: string
 *               userLastName:
 *                 type: string
 *               sysUserDocument:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Bad Request
 */
router.post('/createUser', sysUserController.registerUser);


/**
 * @swagger
 * /api/sysUser/activate/{token}:
 *   get:
 *     tags:
 *       - SysUser
 *     summary: Activate a system user
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: redirect
 *         in: query
 *         required: false
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: User activated successfully
 *       400:
 *         description: Bad Request
 */
router.get('/activate/:token', sysUserController.activateUser);

/**
 * @swagger
 * /api/sysUser/login:
 *   post:
 *     tags:
 *       - SysUser
 *     summary: Log in a system user
 *     requestBody:
 *       description: Login data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       400:
 *         description: Bad Request
 */
router.post('/login', sysUserController.loginUser);

router.post('/loginSwaggerUser', sysUserController.loginSwaggerUser);

router.post('/resendActivationEmail', sysUserController.resendValidation);


/**
 * @swagger
 * /api/sysUser/resetPassword:
 *   post:
 *     tags:
 *       - SysUser
 *     summary: Reset Password
 *     requestBody:
 *       description: Reset Password
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - tempCode
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               tempCode:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password Restored
 *       400:
 *         description: Bad Request
 */
router.post('/resetPassword', sysUserController.resetPassword);

/**
 * @swagger
 * /api/sysUser/generateResetCode:
 *   post:
 *     tags:
 *       - SysUser
 *     summary: Reset Password
 *     requestBody:
 *       description: Reset Password
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password Restored
 *       400:
 *         description: Bad Request
 */
router.post('/generateResetCode', sysUserController.generateResetCode);


module.exports = router;
