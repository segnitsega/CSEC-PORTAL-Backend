/**
 * @swagger
 * tags:
 *   name: Divisions
 *   description: Club divisions management
 */

/**
 * @swagger
 * /api/divisions/allDivisions:
 *   get:
 *     summary: Get all divisions
 *     description: Retrieve a list of all club divisions
 *     tags: [Divisions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved divisions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 example: "Development"
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/divisions/members/{division}:
 *   get:
 *     summary: Get members in a division
 *     description: Retrieve all members in a given division
 *     tags: [Divisions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: division
 *         required: true
 *         schema:
 *           type: string
 *         description: Division name
 *     responses:
 *       200:
 *         description: Successfully retrieved members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Member'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Division not found
 */

/**
 * @swagger
 * /api/divisions/getGroups/{division}:
 *   get:
 *     summary: Get groups in a division
 *     description: Retrieve groups under a specific division
 *     tags: [Divisions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: division
 *         required: true
 *         schema:
 *           type: string
 *         description: Division name
 *     responses:
 *       200:
 *         description: Successfully retrieved groups
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 example: "Frontend Team"
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/divisions/createDivision:
 *   post:
 *     summary: Create a new division
 *     description: Admins can create a new club division
 *     tags: [Divisions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: "AI/ML"
 *               description:
 *                 type: string
 *                 example: "Division focused on Artificial Intelligence and Machine Learning"
 *     responses:
 *       201:
 *         description: Division created successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/divisions/divisionSummary:
 *   get:
 *     summary: Get division summary
 *     description: Returns a summary of divisions and member counts
 *     tags: [Divisions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved division summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 Development: 12
 *                 Design: 8
 *                 AI/ML: 6
 *       401:
 *         description: Unauthorized
 */
