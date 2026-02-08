const postService = require('../services/posts');
const mongoose = require('mongoose');
const APIError = require('../utils/APIError');

const createPost = async (req, res, next) => {
    const post = await postService.createPost(req.user.userId, req.body, req.files);
    res.status(201).json({ 
        success: true, 
        message: "Post created successfully", 
        data: post 
    });
};

const search = async (req, res, next) => {
    const { q, startDate, endDate, tags } = req.query;
    if (!q) throw new APIError("no query found!", 404);
    console.log(q);
    
    const posts = await postService.search(q, startDate, endDate, tags);
    if (!posts || posts.length === 0) {
        throw new APIError("No posts found matching the query", 404);
    }

    res.status(201).json({ 
        success: true, 
        message: "Post found", 
        data: posts
    });

}

const incrementViews = async (req, res, next) => {
    const { id } = req.params;

    // TODO: PREVENT INCREMENTING VIEWS FOR THE SAME USER / IP

    const post = await postService.incrementViews(id);
    if (!post) {
        throw new APIError("Post not found", 404);
    }
    res.status(200).json({
        success: true,
        message: "Post view count incremented",
        data: post
    });
}

const getAllPosts = async (req, res, next) => {
    const posts = await postService.getAllPosts(req.query, req.user.userId);
    res.status(200).json({ 
        success: true, 
        count: posts.length, 
        data: posts 
    });
};

const getPostById = async (req, res, next) => {
    const post = await postService.getPostById(req.params.id, req.user.userId);
    
    if (!post) {
        const APIError = require('../utils/APIError');
        throw new APIError("Post not found", 404);
    }
    
    res.status(200).json({ 
        success: true, 
        data: post 
    });
};

const updatePost = async (req, res, next) => {
    const { id } = req.params;
    
    const updatedPost = await postService.updatePostById(id, req.body, req.user.userId);
    
    if (!updatedPost) {
        const APIError = require('../utils/APIError');
        throw new APIError("Post not found", 404);
    }
    
    res.status(200).json({ 
        success: true, 
        message: "Post updated successfully", 
        data: updatedPost 
    });
};

const deletePost = async (req, res, next) => {
    const { id } = req.params;
    
    const deletedPost = await postService.deletePostById(id, req.user.userId);
    
    if (!deletedPost) {
        const APIError = require('../utils/APIError');
        throw new APIError("Post not found", 404);
    }
    
    res.status(200).json({ 
        success: true, 
        message: "Post deleted successfully", 
        data: deletedPost 
    });
};

const uploadPostImages = async (req, res, next) => {
    const { id } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
        throw new APIError("No files provided", 400);
    }

    const result = await postService.uploadPostImages(id, files);
    
    res.status(200).json({ 
        success: true, 
        message: result.message, 
        data: result.post,
        uploadedUrls: result.uploadedUrls
    });
};

const deletePostImage = async (req, res, next) => {
    const { id } = req.params;
    const { imageUrl } = req.body;

    if (!imageUrl) {
        throw new APIError("Image URL is required", 400);
    }

    const result = await postService.deletePostImage(id, imageUrl);
    
    res.status(200).json({ 
        success: true, 
        message: result.message, 
        data: result.post
    });
};

const getDrafts = async (req, res, next) => {
    const userId = req.user.userId;
    
    const result = await postService.getDrafts(userId, req.query);
    
    res.status(200).json({
        success: true,
        message: "Drafts retrieved successfully",
        data: result.drafts,
        pagination: {
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages
        }
    });
};

const publishPost = async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.userId;
    
    const result = await postService.publishPost(id, userId);
    
    res.status(200).json({
        success: true,
        message: result.message,
        data: result.post
    });
};

const schedulePost = async (req, res, next) => {
    const { id } = req.params;
    const { publishDate } = req.body;
    const userId = req.user.userId;

    if (!publishDate) {
        throw new APIError("Publish date is required", 400);
    }
    
    const result = await postService.schedulePost(id, publishDate, userId);
    
    res.status(200).json({
        success: true,
        message: result.message,
        data: result.post
    });
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    search,
    incrementViews,
    uploadPostImages,
    deletePostImage,
    getDrafts,
    publishPost,
    schedulePost
};