const Comment = require('../models/Comment.model');
const Task = require('../models/Task.model');
const { AppError } = require('../utils/errors');

class CommentService {
  async createComment(commentData, userId) {
    const task = await Task.findById(commentData.task);
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    const comment = await Comment.create({
      ...commentData,
      author: userId
    });

    return await comment.populate('author', 'name email avatar');
  }

  async getCommentsByTask(taskId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const comments = await Comment.find({ task: taskId, parentComment: null })
      .populate('author', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments({ task: taskId, parentComment: null });

    return { comments, total, page, limit };
  }

  async updateComment(commentId, userId, content) {
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    if (comment.author.toString() !== userId.toString()) {
      throw new AppError('Not authorized to update this comment', 403);
    }

    comment.content = content;
    comment.isEdited = true;
    comment.editedAt = new Date();
    await comment.save();

    return await comment.populate('author', 'name email avatar');
  }

  async deleteComment(commentId, userId) {
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    if (comment.author.toString() !== userId.toString()) {
      throw new AppError('Not authorized to delete this comment', 403);
    }

    await comment.deleteOne();
  }
}

module.exports = new CommentService();
