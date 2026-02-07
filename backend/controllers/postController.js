const Post = require("../models/Post");
const User = require("../models/User");

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let imageUrl = null;

    if (req.file) {
      const host = req.get("host");
      const protocol = req.protocol;
      imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    if (!text && !imageUrl) {
      return res.status(400).json({ message: "Post cannot be empty" });
    }

    const post = await Post.create({
      user: {
        userId: req.user.id,
        username: req.user.name
      },
      text,
      image: imageUrl
    });

    res.status(201).json(post);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all posts
exports.getPosts = async (req, res) => {
  try {
    console.log('[postController] getPosts called, user:', req.user ? req.user.id || req.user : 'no-user');
    const posts = await Post.find().sort({ createdAt: -1 });
    console.log(`[postController] fetched ${posts.length} posts`);
    res.json(posts);
  } catch (error) {
    console.error('[postController] error fetching posts:', error);
    res.status(500).json({ message: error.message });
  }
};

// Like or unlike a post
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyLiked = post.likes.find(
      like => like.userId.toString() === req.user.id
    );

    if (alreadyLiked) {
      // Unlike - remove the like
      post.likes = post.likes.filter(
        like => like.userId.toString() !== req.user.id
      );
    } else {
      // Like - add the like
      post.likes.push({
        userId: req.user.id,
        username: req.user.name
      });
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Comment on a post
exports.commentPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (!req.body.text || !req.body.text.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    post.comments.push({
      userId: req.user.id,
      username: req.user.name,
      text: req.body.text
    });

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check if the user owns the post
    if (post.user.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    // Delete all notifications related to this post (removed - no DB notifications)

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Find the comment
    const comment = post.comments.find(c => c._id.toString() === commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Check if the user owns the comment
    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    // Remove the comment
    post.comments = post.comments.filter(c => c._id.toString() !== commentId);
    
    await post.save();
    res.json({ message: "Comment deleted successfully", post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
