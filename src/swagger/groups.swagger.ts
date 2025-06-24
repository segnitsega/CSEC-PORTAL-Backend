/**
 * @swagger
 * tags:
 *   name: Groups
 *   description: Division groups
 */

/**
 * @swagger
 * /api/groups/createGroup:
 *   post:
 *     summary: Create a new group
 *     description: Create a group under a division
 *     tags: [Groups]
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
 *               - division
 *             properties:
 *               division:
 *                 type: string
 *                 example: "Development Division"
 *               group:
 *                 type: string
 *                 example: "Group 2"
 *     responses:
 *       201:
 *         description: Group created successfully
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/groups/getMembers:
 *   get:
 *     summary: Get members in a group
 *     description: Retrieve a filtered list of group members based on division, group, and other optional parameters
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: division
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the division
 *       - in: query
 *         name: group
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the group
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter members
 *       - in: query
 *         name: campusStatus
 *         schema:
 *           type: string
 *           enum: [On Campus, Off Campus]
 *         description: Filter members by campus status
 *       - in: query
 *         name: attendance
 *         schema:
 *           type: string
 *         description: Filter members based on attendance (optional)
 *       - in: query
 *         name: membershipStatus
 *         schema:
 *           type: string
 *           enum: [Active, Inactive]
 *         description: Filter by membership status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of results per page
 *     responses:
 *       200:
 *         description: Successfully retrieved group members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Member'
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
