/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin dashboard operations
 */

/**
 * @swagger
 * /api/admin/heads:
 *   post:
 *     summary: Assign or promote a member as division head
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - division
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "member@csec.com"
 *               division:
 *                 type: string
 *                 example: "Development"
 *     responses:
 *       200:
 *         description: Head assigned successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/admin/banMembers:
 *   post:
 *     summary: Ban multiple members from the platform
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emails
 *             properties:
 *               emails:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: email
 *                 example: ["user1@csec.com", "user2@csec.com"]
 *     responses:
 *       200:
 *         description: Members banned successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
