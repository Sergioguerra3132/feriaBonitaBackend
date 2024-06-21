const express = require('express');
const router = express.Router();
const locationController = require('../controllers/location.controller');
const { authenticateJWT, validateAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: locations
 *   description: locations management
 */

/**
 * @swagger
 * /api/location/getAlllocations:
 *   get:
 *     tags: [locations]
 *     summary: Get all locationss
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: locationss fetched successfully
 */
router.get('/getAlllocations', authenticateJWT, locationController.getAllLocations);

/**
 * @swagger
 * /api/location/createlocation:
 *   post:
 *     tags: [locations]
 *     summary: Create a new location
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               locationDescription:
 *                 type: string
 *               prefix:
 *                 type: string
 *               sitAmount:
 *                 type: integer
 *     responses:
 *       200:
 *         description: location created successfully
 */
router.post('/createlocation', authenticateJWT, locationController.createLocation);

/**
 * @swagger
 * /api/location/updatelocation/{id}:
 *   put:
 *     tags: [locations]
 *     summary: Update an location by ID
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
 *               LocationDescription:
 *                 type: string
 *               location_idlocation:
 *                 type: integer
 *               sitType_idsitType:
 *                 type: integer
 *               LocationPrice:
 *                 type: number
 *     responses:
 *       200:
 *         description: location updated successfully
 */
router.put('/updatelocation/:id', authenticateJWT, locationController.updateLocation);

/**
 * @swagger
 * /api/location/setLocationSitTypePrice:
 *   post:
 *     tags: [locations]
 *     summary: Create a new location
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               location_idlocation:
 *                 type: integer
 *               sittype_idsitType:
 *                 type: integer
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: location created successfully
 */
router.post('/setLocationSitTypePrice', authenticateJWT, locationController.setLocationSitTypePrice);


module.exports = router;