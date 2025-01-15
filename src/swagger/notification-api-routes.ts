/**
 * @swagger
 * /api/device/save:
 *   post:
 *     summary: Save the FCM token as the device ID for a user
 *     tags: [Device]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fcmToken
 *             properties:
 *               fcmToken:
 *                 type: string
 *                 description: The FCM token to be saved as the device ID
 *             example:
 *               fcmToken: "abcdef1234567890"
 *     responses:
 *       200:
 *         description: FCM token saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: FCM token saved successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60f70c80e5b9b70017c2b2c8
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     deviceId:
 *                       type: string
 *                       example: abcdef1234567890
 *       400:
 *         description: Bad request, missing or invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: userId and fcmToken are required.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */
