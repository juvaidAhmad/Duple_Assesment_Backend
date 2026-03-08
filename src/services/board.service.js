const Board = require('../models/Board.model');
const Project = require('../models/Project.model');
const { AppError } = require('../utils/errors');

class BoardService {
  async createBoard(boardData, userId) {
    const project = await Project.findById(boardData.project);
    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const board = await Board.create(boardData);
    return board;
  }

  async getBoardsByProject(projectId) {
    const boards = await Board.find({ project: projectId }).sort({ createdAt: 1 });
    return boards;
  }

  async getBoardById(boardId) {
    const board = await Board.findById(boardId).populate('project', 'name');
    if (!board) {
      throw new AppError('Board not found', 404);
    }
    return board;
  }

  async updateBoard(boardId, updateData) {
    const board = await Board.findByIdAndUpdate(boardId, updateData, {
      new: true,
      runValidators: true
    });

    if (!board) {
      throw new AppError('Board not found', 404);
    }

    return board;
  }

  async deleteBoard(boardId) {
    const board = await Board.findById(boardId);
    if (!board) {
      throw new AppError('Board not found', 404);
    }

    if (board.isDefault) {
      throw new AppError('Cannot delete default board', 400);
    }

    await board.deleteOne();
  }
}

module.exports = new BoardService();
