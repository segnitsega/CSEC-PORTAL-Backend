/**
 * @swagger
 * tags:
 *   name: Rules
 *   description: Club rules
 */

/**
 * @swagger
 * /api/rules:
 *   get:
 *     summary: Get all club rules
 *     description: Retrieve the list of current club rules
 *     tags: [Rules]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved rules
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rules:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/rules:
 *   put:
 *     summary: Update club rules
 *     description: Replace existing rules with new ones
 *     tags: [Rules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rules
 *             properties:
 *               rules:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Rule 1", "Rule 2", "Rule 3"]
 *     responses:
 *       200:
 *         description: Rules updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
