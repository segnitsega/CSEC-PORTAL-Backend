/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: Sessions management
 */

/**
 * @swagger
 * /api/sessions/createSession:
 *   post:
 *     summary: Create a new session
 *     description: Start or register a new session (e.g., weekly club meeting)
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - topic
 *               - date
 *             properties:
 *               topic:
 *                 type: string
 *                 example: "Frontend Best Practices"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-07-05"
 *               summary:
 *                 type: string
 *                 example: "Covered key practices for building clean UIs"
 *     responses:
 *       201:
 *         description: Session created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/sessions:
 *   get:
 *     summary: Get all sessions
 *     description: Retrieve a list of past and upcoming sessions
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   topic:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date
 *                   summary:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/sessions/{id}:
 *   delete:
 *     summary: Delete a session
 *     description: Remove a session by ID (admin only)
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *     responses:
 *       200:
 *         description: Session deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Session not found
 */

/**
 * @swagger
 * /api/sessions/{id}:
 *   put:
 *     summary: Update a session
 *     description: Edit session topic, date, or summary
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               topic:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               summary:
 *                 type: string
 *     responses:
 *       200:
 *         description: Session updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Session not found
 */
