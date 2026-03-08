const commentService = require('../services/comment.service');
const { successResponse, paginatedResponse } = require('../utils/response');

exports.createComment = async (req, res, next) => {
  try {
    const comment = await commentService.createComment(req.body, req.user._id);
    successResponse(res, 201, { comment }, 'Comment created successfully');
  } catch (error) {
    next(error);
  }
};

exports.getCommentsByTask = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const result = await commentService.getCommentsByTask(req.params.taskId, page, limit);

    paginatedResponse(res, 200, result.comments, {
      page: result.page,
      limit: result.limit,
      total: result.total
    });
  } catch (error) {
    next(error);
  }
};

exports.updateComment = async (req, res, next) => {
  try {
    const comment = await commentService.updateComment(
      req.params.id,
      req.user._id,
      req.body.content
    );
    successResponse(res, 200, { comment }, 'Comment updated successfully');
  } catch (error) {
    next(error);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    await commentService.deleteComment(req.params.id, req.user._id);
    successResponse(res, 200, null, 'Comment deleted successfully');
  } catch (error) {
    next(error);
  }
};
