/**
 * @swagger
 * /api/upload/pdf:
 *   post:
 *     summary: Upload a PDF file
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: pdf
 *         type: file
 *         required: true
 *       - in: formData
 *         name: title
 *         type: string
 *         required: true
 *       - in: formData
 *         name: description
 *         type: string
 *         required: true
 *       - in: formData
 *         name: category
 *         type: string
 *         required: true
 *     responses:
 *       201:
 *         description: PDF uploaded successfully
 *       400:
 *         description: Error uploading PDF
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/upload/image:
 *   post:
 *     summary: Upload an image file
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *         required: true
 *       - in: formData
 *         name: title
 *         type: string
 *         required: true
 *       - in: formData
 *         name: description
 *         type: string
 *         required: true
 *       - in: formData
 *         name: category
 *         type: string
 *         required: true
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
 * /api/upload/video:
 *   post:
 *     summary: Upload a video file
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: video
 *         type: file
 *         required: true
 *       - in: formData
 *         name: videoTitle
 *         type: string
 *         required: true
 *       - in: formData
 *         name: description
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Video uploaded successfully
 *       400:
 *         description: Error uploading video
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/posts/{postId}:
 *   get:
 *     summary: Get a post by its ID
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Post fetched successfully
 *       400:
 *         description: Post not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/videos/{videoId}:
 *   get:
 *     summary: Get a video by its ID
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Video fetched successfully
 *       400:
 *         description: Video not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts by the user
 *     responses:
 *       200:
 *         description: Posts fetched successfully
 *       400:
 *         description: Unable to retrieve posts
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/delete:
 *   delete:
 *     summary: Delete content (post or video)
 *     parameters:
 *       - in: body
 *         name: postId
 *         type: string
 *       - in: body
 *         name: videoId
 *         type: string
 *     responses:
 *       200:
 *         description: Content deleted successfully
 *       400:
 *         description: Content not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/filter:
 *   post:
 *     summary: Filter posts by tag
 *     parameters:
 *       - in: body
 *         name: tag
 *         type: string
 *     responses:
 *       200:
 *         description: Filtered posts retrieved successfully
 *       400:
 *         description: No contents available or invalid tag
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/filterByUser:
 *   post:
 *     summary: Filter posts by tag for a specific user
 *     parameters:
 *       - in: body
 *         name: tag
 *         type: string
 *     responses:
 *       200:
 *         description: Filtered posts retrieved successfully for the user
 *       400:
 *         description: No contents available or invalid tag
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/filterByTime:
 *   post:
 *     summary: Filter posts by time (e.g., last 7 days)
 *     parameters:
 *       - in: body
 *         name: past
 *         type: integer
 *     responses:
 *       200:
 *         description: Filtered posts retrieved by time
 *       400:
 *         description: No contents available or invalid time
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/search:
 *   post:
 *     summary: Search posts and videos by keyword
 *     parameters:
 *       - in: body
 *         name: keyword
 *         type: string
 *     responses:
 *       200:
 *         description: Matching posts and videos fetched successfully
 *       400:
 *         description: No posts found or invalid keyword
 *       500:
 *         description: Server error
 */
