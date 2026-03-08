const express = require('express');
const { body } = require('express-validator');
const commentController = require('../controllers/comment.controller');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

router.use(protect);

router.post('/', [
  body('content').trim().isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1-1000 characters'),
  body('task').isMongoId().withMessage('Valid task ID is required'),
  validate
], commentController.createComment);

router.get('/task/:taskId', commentController.getCommentsByTask);
router.put('/:id', commentController.updateComment);
router.delete('/:id', commentController.deleteComment);

module.exports = router;
