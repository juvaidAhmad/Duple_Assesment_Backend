const Task = require('../models/Task.model');
const Board = require('../models/Board.model');
const Project = require('../models/Project.model');
const { AppError } = require('../utils/errors');

class TaskService {
  async createTask(taskData, userId) {
    const board = await Board.findById(taskData.board);
    if (!board) {
      throw new AppError('Board not found', 404);
    }

    const task = await Task.create({
      ...taskData,
      project: board.project,
      createdBy: userId
    });

    return await task.populate([
      { path: 'assignedTo', select: 'name email avatar' },
      { path: 'createdBy', select: 'name email avatar' }
    ]);
  }

  async getTasks(filters = {}, page = 1, limit = 50) {
    const query = {};
    
    if (filters.board) query.board = filters.board;
    if (filters.project) query.project = filters.project;
    if (filters.status) query.status = filters.status;
    if (filters.priority) query.priority = filters.priority;
    if (filters.assignedTo) query.assignedTo = filters.assignedTo;
    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    const skip = (page - 1) * limit;
    const tasks = await Task.find(query)
      .populate('assignedTo createdBy', 'name email avatar')
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Task.countDocuments(query);

    return { tasks, total, page, limit };
  }

  async getTaskById(taskId) {
    const task = await Task.findById(taskId)
      .populate('assignedTo createdBy', 'name email avatar')
      .populate('board', 'name')
      .populate('project', 'name');

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    return task;
  }

  async updateTask(taskId, userId, updateData) {
    const task = await Task.findById(taskId);
    
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // Store original for activity tracking
    task._original = task.toObject();

    Object.assign(task, updateData);
    
    // Add user to activity history
    if (task.activityHistory.length > 0) {
      task.activityHistory[task.activityHistory.length - 1].user = userId;
    }

    await task.save();

    return await task.populate('assignedTo createdBy', 'name email avatar');
  }

  async deleteTask(taskId) {
    const task = await Task.findById(taskId);
    
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    await task.deleteOne();
  }

  async reorderTasks(boardId, status, taskOrders) {
    const updatePromises = taskOrders.map(({ taskId, order }) =>
      Task.findByIdAndUpdate(taskId, { order, status })
    );

    await Promise.all(updatePromises);
  }

  async getTasksByBoard(boardId) {
    const tasks = await Task.find({ board: boardId })
      .populate('assignedTo createdBy', 'name email avatar')
      .sort({ order: 1 });

    return tasks;
  }
}

module.exports = new TaskService();
