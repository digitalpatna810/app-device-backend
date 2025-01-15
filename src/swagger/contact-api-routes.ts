/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       required:
 *         - contactName
 *         - contactNumber
 *       properties:
 *         contactName:
 *           type: string
 *           description: The name of the contact
 *         contactNumber:
 *           type: string
 *           description: The 10-digit contact number
 *         deviceId:
 *           type: string
 *           description: The device ID associated with the user
 *       example:
 *         contactName: John Doe
 *         contactNumber: "1234567890"
 *         deviceId: abc123
 */

/**
 * @swagger
 * /api/contacts:
 *   post:
 *     summary: Create a new contact
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       200:
 *         description: Contact created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Contact saved successfully
 *                 data:
 *                   $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/contacts/{contactId}:
 *   get:
 *     summary: Get a contact by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the contact
 *     responses:
 *       200:
 *         description: Contact fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Contact details fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     contact:
 *                       $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     summary: Get all contacts
 *     tags: [Contacts]
 *     responses:
 *       200:
 *         description: List of all contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 *       400:
 *         description: No contacts available
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/contacts/{contactId}:
 *   put:
 *     summary: Update a contact
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the contact to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Contact updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Invalid input or contact not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/contacts/{contactId}:
 *   delete:
 *     summary: Delete a contact
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the contact to delete
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *       400:
 *         description: Contact not found or unable to delete
 *       500:
 *         description: Internal server error
 */
