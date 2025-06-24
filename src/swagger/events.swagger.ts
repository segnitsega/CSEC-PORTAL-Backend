/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Events management
 */

/**
 * @swagger
 * /api/events/addEvent:
 *   post:
 *     summary: Add a new event
 *     description: Add a new club event (admin only)
 *     tags: [Events]
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
 *               - date
 *               - location
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Tech Talk on AI"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-07-01"
 *               location:
 *                 type: string
 *                 example: "Main Hall"
 *               description:
 *                 type: string
 *                 example: "A session discussing the latest trends in AI"
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events
 *     description: Retrieve a list of all events
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "123abc"
 *                   title:
 *                     type: string
 *                     example: "Tech Talk on AI"
 *                   date:
 *                     type: string
 *                     format: date
 *                   location:
 *                     type: string
 *                   description:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Delete an event
 *     description: Delete a specific event by ID (admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Event not found
 */

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Update an event
 *     description: Update the details of an event (admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               location:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Event not found
 */
