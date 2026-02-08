const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  createPost,
  getPosts,
  getMyPosts,
  getLikedPosts,
  likePost,
  commentPost,
  deletePost,
  deleteComment
} = require("../controllers/postController");

const auth = require("../middleware/authMiddleware");

// configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

const router = express.Router();

router.post("/", auth, upload.single("image"), createPost);
router.get("/", getPosts);
router.get("/my-posts", auth, getMyPosts);
router.get("/liked", auth, getLikedPosts);
router.post("/:id/like", auth, likePost);
router.post("/:id/comment", auth, commentPost);
router.delete("/:id", auth, deletePost);
router.delete("/:postId/comment/:commentId", auth, deleteComment);

module.exports = router;
