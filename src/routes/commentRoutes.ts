import express from 'express';
import { createComment, getComments, getCommentById, updateComment, deleteComment } from '../controllers/commentController';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

// Route to create a new comment
/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Content of the comment
 *               post:
 *                 type: string
 *                 description: ID of the associated post
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 content:
 *                   type: string
 *                 post:
 *                   type: string
 *                 sender:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, createComment);

// Route to get all comments
/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get all comments
 *     responses:
 *       200:
 *         description: A list of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   content:
 *                     type: string
 *                   post:
 *                     type: string
 *                   sender:
 *                     type: string
 */
router.get('/', getComments);

// Route to get a specific comment by ID
/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Get a comment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the comment
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested comment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 content:
 *                   type: string
 *                 post:
 *                   type: string 
 *                 sender:
 *                   type: string
 */
router.get('/:id', getCommentById);

// Route to update a specific comment by ID
/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Update a comment by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the comment
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Updated content of the comment
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 content:
 *                   type: string
 *                 post:
 *                   type: string
*                 sender:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', authenticate, updateComment);

// Route to delete a specific comment by ID
/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the comment
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', authenticate, deleteComment);

export default router;
