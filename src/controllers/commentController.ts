import Comment from '../models/comment';

export const getComments = async (req: any, res: any) => {
  const comments = await Comment.find();
  
  res.json(comments);
};

export const getCommentById = async (req: any, res: any) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) res.sendStatus(404);
  else res.json(comment);
};

export const createComment = async (req: any, res: any) => {
  const { content, post } = req.body;
  const sender = req.user;
  const comment = new Comment({
    content,
    post,
    sender
  });
  await comment.save();
  res.status(201).json(comment);
};

export const updateComment = async (req: any, res: any) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.sendStatus(404);

  const { content } = req.body;
  comment.content = content || comment.content;
  await comment.save();
  res.json(comment);
};

export const deleteComment = async (req: any, res: any) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).send({ message: "Post not found" });
  await Comment.deleteOne({ _id: req.params.id });
  res.json({ message: "Post deleted" });
};
