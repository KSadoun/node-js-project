const mongoose = require('mongoose');
const Post = require('../models/posts');

const APIError = require('../utils/APIError');

const imageKitService = require('./imageKit');

const createPost = async (userId, postData, files) => {
    const { title, content, author } = postData;
    if (!title || !content || !author) {
        throw new APIError("title, content and author are required fields", 400);
    }

    const post = await Post.create({ ...postData, userId, images: [] });

    // Upload images if provided
    if (files && files.length > 0) {
        for (const file of files) {
            const uploadedImage = await imageKitService.uploadImage(
                file,
                `posts/${post._id}`,
                `post-${post._id}-${Date.now()}`
            );
            post.images.push(uploadedImage.url);
        }
        await post.save();
    }
    
    return post;
}

const incrementViews = async (id) => {
    const post = await Post.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
    return post;
}

const search = async (query, startDate, endDate, tags) => {

    const filters = {};

    // query 
    filters.$or = [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
    ]

    // dates
     if (startDate || endDate) filters.createdAt = {};
    if (startDate) filters.createdAt.$gte = new Date(startDate)
    if (endDate) filters.createdAt.$lte = new Date(endDate)

    // tags
    if (tags) filters.tags = { $in: tags };

    const posts = await Post.find(filters).populate("userId", "name email");
    return posts;
}

const getAllPosts = async (query, userId) => {

    const { page = 1, limit = 2 } = query;
    const posts = await Post.find({}, { password: 0 }).populate("userId", "name email").skip((page - 1) * limit).limit(limit);
    
    const postsWithOwnerFlag = posts.map(post => {
        const postObj = post.toObject();
        postObj.isOwner = postObj.userId._id.toString() === userId.toString();
        return postObj;
    });
    
    return postsWithOwnerFlag;
}

const getPostById = async (id, userId) => {

    const post = await Post.findOne({"_id": id}).populate("userId", "name email");
    
    if (!post) {
        return null;
    }

    const postObj = post.toObject();
    postObj.isOwner = postObj.userId._id.toString() === userId.toString();
    return postObj;
}

const updatePostById = async (id, postData) => {
    
    const { title, content, tags } = postData;
    
    const update = await Post.findOneAndUpdate({"_id": id}, {
        title,
        content,
        tags
    }, { new: true });
    return update;
}

const deletePostById = async (id) => {
    const deleted = await Post.findByIdAndDelete(id);
    if (!deleted) throw new APIError("Post not found", 404);
    return deleted;
}

const uploadPostImages = async (postId, files) => {
    if (!files || files.length === 0) {
        throw new APIError("No files provided", 400);
    }

    const post = await Post.findById(postId);
    if (!post) throw new APIError("Post not found", 404);

    const uploadedUrls = [];
    for (const file of files) {
        const uploadedImage = await imageKitService.uploadImage(
            file,
            `posts/${postId}`,
            `post-${postId}-${Date.now()}`
        );
        post.images.push(uploadedImage.url);
        uploadedUrls.push(uploadedImage.url);
    }

    await post.save();
    return { 
        message: "Images uploaded successfully",
        post,
        uploadedUrls
    };
}

const deletePostImage = async (postId, imageUrl) => {
    const post = await Post.findById(postId);
    if (!post) throw new APIError("Post not found", 404);

    const imageIndex = post.images.indexOf(imageUrl);
    if (imageIndex === -1) {
        throw new APIError("Image not found in post", 404);
    }

    post.images.splice(imageIndex, 1);
    await post.save();

    return {
        message: "Image deleted successfully",
        post
    };
}

const getDrafts = async (userId, query) => {
    const { page = 1, limit = 10 } = query;
    
    const drafts = await Post.find({ userId, status: 'draft' })
        .populate("userId", "name email")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

    const total = await Post.countDocuments({ userId, status: 'draft' });

    return {
        drafts,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
    };
}

const publishPost = async (postId, userId) => {
    const post = await Post.findById(postId);
    if (!post) throw new APIError("Post not found", 404);

    // Check if user is the post author
    if (post.userId.toString() !== userId.toString()) {
        throw new APIError("You can only publish your own posts", 403);
    }

    // Check if post is draft
    if (post.status !== 'draft') {
        throw new APIError("Only draft posts can be published", 400);
    }

    // Update post status and set publishedAt
    post.status = 'published';
    post.publishedAt = new Date();
    await post.save();

    return {
        message: "Post published successfully",
        post
    };
}

const schedulePost = async (postId, publishDate, userId) => {
    const post = await Post.findById(postId);
    if (!post) throw new APIError("Post not found", 404);

    // Check if user is the post author
    if (post.userId.toString() !== userId.toString()) {
        throw new APIError("You can only schedule your own posts", 403);
    }

    // Check if post is draft
    if (post.status !== 'draft') {
        throw new APIError("Only draft posts can be scheduled", 400);
    }

    // Validate the publish date is in the future
    const scheduledDate = new Date(publishDate);
    if (scheduledDate <= new Date()) {
        throw new APIError("Schedule date must be in the future", 400);
    }

    // Update post status and set publishedAt
    post.status = 'scheduled';
    post.publishedAt = scheduledDate;
    await post.save();

    return {
        message: "Post scheduled successfully",
        post
    };
}

module.exports = { createPost, getAllPosts, getPostById, updatePostById, deletePostById, search, incrementViews, uploadPostImages, deletePostImage, getDrafts, publishPost, schedulePost }; 