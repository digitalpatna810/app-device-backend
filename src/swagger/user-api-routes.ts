/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: API endpoints for managing posts and videos
 */

/**
 * @swagger
 * /posts/user-posts:
 *   get:
 *     summary: Retrieve all posts and videos of a user
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved posts and videos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     posts:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Post'
 *                     videos:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Video'
 *       400:
 *         description: Unable to retrieve posts
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /post/{postId}:
 *   get:
 *     summary: Retrieve a post by its ID
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         description: ID of the post
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the post
 *       400:
 *         description: Unable to retrieve the post
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /video/{videoId}:
 *   get:
 *     summary: Retrieve a video by its ID
 *     tags: [Videos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: videoId
 *         in: path
 *         required: true
 *         description: ID of the video
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the video
 *       400:
 *         description: Unable to retrieve the video
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /post/image:
 *   post:
 *     summary: Upload an image post
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 *       400:
 *         description: Error uploading image
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /post/video:
 *   post:
 *     summary: Upload a video post
 *     tags: [Videos]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *               videoTitle:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Video uploaded successfully
 *       400:
 *         description: Error uploading video
 *       500:
 *         description: Failed to upload video
 */

/**
 * @swagger
 * /deleteContent:
 *   delete:
 *     summary: Delete a post or video by ID
 *     tags: [Posts, Videos]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *               videoId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Content deleted successfully
 *       400:
 *         description: Invalid content ID or content not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /filterPosts:
 *   get:
 *     summary: Filter posts by category tag
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: tag
 *         in: query
 *         required: true
 *         description: Category tag to filter by
 *         schema:
 *           type: string
 *           enum: [medical, engineering, news, gallery]
 *     responses:
 *       200:
 *         description: Posts retrieved successfully
 *       400:
 *         description: Invalid tag
 *       404:
 *         description: No posts available
 *       500:
 *         description: Internal server error
 */