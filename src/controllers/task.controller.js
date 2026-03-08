const taskService = require('../services/task.service');
const { successResponse, paginatedResponse } = require('../utils/response');

exports.createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.body, req.user._id);
    successResponse(res, 201, { task }, 'Task created successfully');
  } catch (error) {
    next(error);
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    const { board, project, status, priority, assignedTo, search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    const result = await taskService.getTasks(
      { board, project, status, priority, assignedTo, search },
      page,
      limit
    );

    paginatedResponse(res, 200, result.tasks, {
      page: result.page,
      limit: result.limit,
      total: result.total
    });
  } catch (error) {
    next(error);
  }
};

exports.getTask = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.params.id);
    successResponse(res, 200, { task }, 'Task retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.user._id, req.body);
    successResponse(res, 200, { task }, 'Task updated successfully');
  } catch (error) {
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.params.id);
    successResponse(res, 200, null, 'Task deleted successfully');
  } catch (error) {
    next(error);
  }
};

exports.reorderTasks = async (req, res, next) => {
  try {
    const { boardId, status, taskOrders } = req.body;
    await taskService.reorderTasks(boardId, status, taskOrders);
    successResponse(res, 200, null, 'Tasks reordered successfully');
  } catch (error) {
    next(error);
  }
};

exports.getTasksByBoard = async (req, res, next) => {
  try {
    const tasks = await taskService.getTasksByBoard(req.params.boardId);
    successResponse(res, 200, { tasks }, 'Tasks retrieved successfully');
  } catch (error) {
    next(error);
  }
};
