// posts.js
const asyncHandler = require('express-async-handler');
const Post = require('../models/post'); 

const getPosts = asyncHandler(async (req, res) => {

  try {
    const posts = await Post
      .find()
      .sort({timestamp: -1}) 
      .populate('author', 'username')

    res.json(posts)

  } catch (err) {
    console.error(err);
    res.status(400).send('Server error');
  } 
}
)
const createPost = asyncHandler(async (req, res) => {
  const {content} = req.body;
  const author = req.user._id;
  if (!content) {
    return res.status(400).send('Please write something');
  } 
  try {
      const newPost = await Post.create({content, author});
      const post = await Post
        .findById(newPost._id)
        .populate('author', 'username')
      res.json(post);
    } catch (err) {
      console.error(err);
      res.status(400).send('Server error');
    }
})


module.exports = {getPosts,createPost}; 