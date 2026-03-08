const express = require('express');
const { body } = require('express-validator');
const boardController = require('../controllers/board.controller');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

router.use(protect);

router.post('/', [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Board name must be between 2-100 characters'),
  body('project').isMongoId().withMessage('Valid project ID is required'),
  validate
], boardController.createBoard);

router.get('/project/:projectId', boardController.getBoardsByProject);
router.get('/:id', boardController.getBoard);
router.put('/:id', boardController.updateBoard);
router.delete('/:id', boardController.deleteBoard);

module.exports = router;
