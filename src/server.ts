import app from './app';
import connectDB from "./config/db"; // Import connectDB here

const PORT = process.env.PORT || 3000;

// Connect to Database before starting the server
connectDB(); 

app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});