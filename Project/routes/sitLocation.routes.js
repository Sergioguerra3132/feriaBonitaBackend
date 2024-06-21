const express = require('express');
const router = express.Router();
const sitLocationController = require('../controllers/sitLocation.controller');
const { authenticateJWT, validateAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: sitlocations
 *   description: sitlocations management
 */

/**
 * @swagger
 * /api/sitlocation/getAllSitlocations:
 *   get:
 *     tags: [sitlocations]
 *     summary: Get all sitlocationss
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: sitlocationss fetched successfully
 */
router.get('/getAllSitlocations', authenticateJWT, sitLocationController.getAllSitlocations);

/**
 * @swagger
 * /api/sitlocation/createsitlocation:
 *   post:
 *     tags: [sitlocations]
 *     summary: Create a new sitlocation
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sitLocationDescription:
 *                 type: string
 *               location_idlocation:
 *                 type: integer
 *               sitType_idsitType:
 *                 type: integer
 *               sitLocationPrice:
 *                 type: number
 *     responses:
 *       200:
 *         description: sitlocation created successfully
 */
router.post('/createsitlocation', authenticateJWT, sitLocationController.createSitlocation);

/**
 * @swagger
 * /api/sitlocation/updatesitlocation/{id}:
 *   put:
 *     tags: [sitlocations]
 *     summary: Update an sitlocation by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sitLocationDescription:
 *                 type: string
 *               location_idlocation:
 *                 type: integer
 *               sitType_idsitType:
 *                 type: integer
 *               sitLocationPrice:
 *                 type: number
 *     responses:
 *       200:
 *         description: sitlocation updated successfully
 */
router.put('/updatesitlocation/:id', authenticateJWT, sitLocationController.updateSitlocation);

module.exports = router;