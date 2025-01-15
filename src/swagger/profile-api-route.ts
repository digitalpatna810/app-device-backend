/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Fetch user profile by user ID
 *     description: Fetches the profile data of a user by their user ID.
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *       400:
 *         description: User ID not found
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/profile/edit:
 *   put:
 *     summary: Edit user profile
 *     description: Updates the user's first name, last name, and email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
