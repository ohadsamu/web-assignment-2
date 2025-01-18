import mongoose from "mongoose";

export interface IComments {
  content: string;
  sender: string;
  post: string;
}
const commentsSchema = new mongoose.Schema<IComments>({
  content: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  post: {
    type: String,
    required: true,
  },
});

const commentsModel = mongoose.model<IComments>("Comments", commentsSchema);

export default commentsModel;