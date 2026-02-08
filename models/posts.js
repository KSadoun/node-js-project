const mongoose = require("mongoose");
const User = require("./users");

const postSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    tags: Array,
    images: [String],
    views: { type: Number, default: 0 },
    status: { enum: ['draft', 'published', 'scheduled'], default: 'draft', type: String },
    publishedAt: { type: Date, optional: true },
    likes: { type: Number, default: 0 }
}, { timestamps: true });

postSchema.index({
    title: 'text',
    content: 'text'
});

const Post = mongoose.model('Post', postSchema);



module.exports = Post;