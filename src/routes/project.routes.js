const express = require('express');
const { body } = require('express-validator');
const projectController = require('../controllers/project.controller');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

router.use(protect);

router.post('/', [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Project name must be between 2-100 characters'),
  validate
], projectController.createProject);

router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

router.post('/:id/members', projectController.addMember);
router.delete('/:id/members/:memberId', projectController.removeMember);

module.exports = router;
