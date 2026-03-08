const boardService = require('../services/board.service');
const { successResponse } = require('../utils/response');

exports.createBoard = async (req, res, next) => {
  try {
    const board = await boardService.createBoard(req.body, req.user._id);
    successResponse(res, 201, { board }, 'Board created successfully');
  } catch (error) {
    next(error);
  }
};

exports.getBoardsByProject = async (req, res, next) => {
  try {
    const boards = await boardService.getBoardsByProject(req.params.projectId);
    successResponse(res, 200, { boards }, 'Boards retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.getBoard = async (req, res, next) => {
  try {
    const board = await boardService.getBoardById(req.params.id);
    successResponse(res, 200, { board }, 'Board retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.updateBoard = async (req, res, next) => {
  try {
    const board = await boardService.updateBoard(req.params.id, req.body);
    successResponse(res, 200, { board }, 'Board updated successfully');
  } catch (error) {
    next(error);
  }
};

exports.deleteBoard = async (req, res, next) => {
  try {
    await boardService.deleteBoard(req.params.id);
    successResponse(res, 200, null, 'Board deleted successfully');
  } catch (error) {
    next(error);
  }
};
