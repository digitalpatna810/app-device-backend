/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and Authorization API
 */

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login with email or phone number and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: user@example.com
 *               password: Password@123
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                 token:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/logout:
 *   post:
 *     summary: Logout user and clear tokens
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successful logout
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *             example:
 *               refreshToken: some-refresh-token
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Unauthorized or invalid token
 */

/**
 * @swagger
 * /api/signup:
 *   post:
 *     summary: Sign up a new user
 *     tags: [Auth]
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
 *               phoneNumber:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *             example:
 *               firstName: John
 *               lastName: Doe
 *               email: john@example.com
 *               phoneNumber: "1234567890"
 *               password: Password@123
 *               confirmPassword: Password@123
 *     responses:
 *       201:
 *         description: Sign-up successful
 *       400:
 *         description: Bad request
 *       409:
 *         description: User already exists
 */

/**
 * @swagger
 * /api/forgot-password:
 *   post:
 *     summary: Initiate password reset by sending an OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *             example:
 *               email: user@example.com
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/verify-otp:
 *   post:
 *     summary: Verify OTP for password reset or phone verification
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               otp:
 *                 type: string
 *             example:
 *               email: user@example.com
 *               otp: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid or expired OTP
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/reset-password:
 *   post:
 *     summary: Reset user password after OTP verification
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             example:
 *               email: user@example.com
 *               newPassword: Password@123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */