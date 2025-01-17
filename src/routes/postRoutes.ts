import express from "express";
import {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  getPostById,
} from "../controllers/postController";

const router = express.Router();

// Route to create a new post
/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     responses:
 *       201:
 *         description: Post created successfully
 */
router.post('/', createPost);

// Route to get all posts
/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     responses:
 *       200:
 *         description: A list of posts
 */
router.get('/', getPosts);

// Route to get a specific post by ID
/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the post
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested post
 */
router.get('/:id', getPostById);

// Route to update a specific post by ID
/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update a post by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the post
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post updated successfully
 */
router.put('/:id', updatePost);

// Route to delete a specific post by ID
/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the post
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted successfully
 */
router.delete('/:id', deletePost);

export default router;
