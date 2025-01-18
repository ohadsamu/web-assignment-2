import Post from "../models/post";

export const createPost = async (req: any, res: any) => {
  const { title, content } = req.body;
  const sender = req.user;
  const post = new Post({
    title,
    content,
    sender
  });
  await post.save();
  res.status(201).json(post);
};

export const getPosts = async (req: any, res: any) => {
  const { sender } = req.query;
  if (sender) {
    const posts = await Post.find({ sender: req.query.sender });
    res.json(posts);
  }

  const posts = await Post.find();
  
  res.json(posts);
};

export const getPostById = async (req: any, res: any) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.sendStatus(404);

  res.json(post);
};

export const updatePost = async (req: any, res: any) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.sendStatus(404);

  const { title, content } = req.body;
  post.title = title || post.title;
  post.content = content || post.content;
  await post.save();
  res.json(post);
};

export const deletePost = async (req: any, res: any) => {
  const post = await Post.findById(req.params.id);
  if (!post) res.sendStatus(404);
  await Post.findByIdAndDelete({ _id: req.params.id });
  res.json({ message: "Post deleted" });
};
