import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import postRoutes from "./routes/postRoutes";
import commentRoutes from "./routes/commentRoutes";
// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);

export default app;
