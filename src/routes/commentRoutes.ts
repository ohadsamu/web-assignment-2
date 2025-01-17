import express from 'express';
import { createComment, getComments, getCommentById, updateComment, deleteComment } from '../controllers/commentController';

const router = express.Router();

// Route to create a new comment
/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     responses:
 *       201:
 *         description: Comment created successfully
 */
router.post('/', createComment);

// Route to get all comments
/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get all comments
 *     responses:
 *       200:
 *         description: A list of comments
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
 */
router.get('/:id', getCommentById);

// Route to update a specific comment by ID
/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Update a comment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the comment
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment updated successfully
 */
router.put('/:id', updateComment);

// Route to delete a specific comment by ID
/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment by ID
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
 */
router.delete('/:id', deleteComment);

export default router;