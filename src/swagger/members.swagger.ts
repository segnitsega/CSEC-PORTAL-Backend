/**
 * @swagger
 * tags:
 *   name: Members
 *   description: Club members management
 */

/**
 * @swagger
 * /api/members/login:
 *   post:
 *     summary: Member login
 *     description: Login with email and password
 *     tags: [Members]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@csec.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "userPassword"
 *     responses:
 *       200:
 *         description: Login successful, returns access and refresh token
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/members:
 *   get:
 *     summary: Get all members
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve a list of all registered club members.
 *     responses:
 *       200:
 *         description: List of members returned successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/members/heads:
 *   get:
 *     summary: Get all division heads
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all users with the role of 'head'.
 *     responses:
 *       200:
 *         description: List of heads returned successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/members/refresh:
 *   post:
 *     summary: Refresh access token
 *     security:
 *       - bearerAuth: []
 *     tags: [Members]
 *     responses:
 *       200:
 *         description: New access token returned
 *       401:
 *         description: Invalid or expired refresh token
 */

/**
 * @swagger
 * /api/members/createMember:
 *   post:
 *     summary: Register a new member
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MemberOnboarding'
 *     responses:
 *       201:
 *         description: Member created successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/members/profileDetails:
 *   post:
 *     summary: Update member profile
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *               bio:
 *                 type: string
 *               position:
 *                 type: string
 *               division:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 *       400:
 *         description: Bad input
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/members/{id}:
 *   get:
 *     summary: Get member by ID
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Member not found
 *
 *   delete:
 *     summary: Delete member by ID
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Member not found
 */
