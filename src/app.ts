import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import postRoutes from "./routes/postRoutes";
import commentRoutes from "./routes/commentRoutes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swaggerConfig";
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

// Swagger API Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
