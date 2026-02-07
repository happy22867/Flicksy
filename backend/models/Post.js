const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  user: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  text: String,
  image: String,
  likes: [
    {
      userId: mongoose.Schema.Types.ObjectId,
      username: String
    }
  ],
  comments: [
    {
      userId: mongoose.Schema.Types.ObjectId,
      username: String,
      text: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);
