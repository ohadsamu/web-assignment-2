import mongoose from "mongoose";
const CommentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
});

export default mongoose.model("Comment", CommentSchema);
