import mongoose from "mongoose";
const CommentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  sender: { type: String, required: true },
});

export default mongoose.model("Comment", CommentSchema);
