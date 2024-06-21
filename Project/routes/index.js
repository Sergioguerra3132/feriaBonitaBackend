const express = require('express');
const sysUserRoutes = require('./sysUser.routes')
const sitLocationRoutes = require('./sitLocation.routes')
const locationRoutes = require('./location.routes')

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */


router.use('/sysUser', sysUserRoutes);
router.use('/sitLocation', sitLocationRoutes);
router.use('/location', locationRoutes);

module.exports = router;
