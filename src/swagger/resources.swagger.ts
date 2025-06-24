/**
 * @swagger
 * tags:
 *   name: Resources
 *   description: Learning resources
 */

/**
 * @swagger
 * /api/resources:
 *   get:
 *     summary: Get all resources
 *     description: Retrieve a list of learning resources
 *     tags: [Resources]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched resources
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                   link:
 *                     type: string
 *                   description:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/resources/addResource:
 *   post:
 *     summary: Add a new resource
 *     description: Upload or share a new learning resource
 *     tags: [Resources]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - link
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Intro to Data Structures"
 *               link:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/data-structures"
 *               description:
 *                 type: string
 *                 example: "Video tutorial on basics of DS"
 *     responses:
 *       201:
 *         description: Resource added successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/resources/{id}:
 *   delete:
 *     summary: Delete a resource
 *     description: Remove a specific resource by ID
 *     tags: [Resources]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Resource ID
 *     responses:
 *       200:
 *         description: Resource deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Resource not found
 */

/**
 * @swagger
 * /api/resources/{id}:
 *   put:
 *     summary: Update a resource
 *     description: Modify an existing resource’s details
 *     tags: [Resources]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Resource ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               link:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Resource updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Resource not found
 */
