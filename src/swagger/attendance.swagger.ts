/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Attendance tracking
 */

/**
 * @swagger
 * /api/attendance:
 *   post:
 *     summary: Submit attendance for a session
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *             properties:
 *               sessionId:
 *                 type: string
 *                 example: "665f4d1f3a6b5c001b2c9a8e"
 *               attended:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Attendance submitted successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/attendance/data/{sessionId}:
 *   get:
 *     summary: Get attendance data for a session
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the session
 *     responses:
 *       200:
 *         description: Attendance data retrieved
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Session not found
 */

/**
 * @swagger
 * /api/attendance/member/{memberId}:
 *   get:
 *     summary: Get a member's attendance summary
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the member
 *     responses:
 *       200:
 *         description: Member attendance summary retrieved
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Member not found
 */
