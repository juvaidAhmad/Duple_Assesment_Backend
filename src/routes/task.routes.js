const express = require('express');
const { body } = require('express-validator');
const taskController = require('../controllers/task.controller');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

router.use(protect);

router.post('/', [
  body('title').trim().isLength({ min: 2, max: 200 }).withMessage('Title must be between 2-200 characters'),
  body('board').isMongoId().withMessage('Valid board ID is required'),
  validate
], taskController.createTask);

router.get('/', taskController.getTasks);
router.get('/board/:boardId', taskController.getTasksByBoard);
router.get('/:id', taskController.getTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.post('/reorder', taskController.reorderTasks);

module.exports = router;
