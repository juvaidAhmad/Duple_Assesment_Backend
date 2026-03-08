const projectService = require('../services/project.service');
const { successResponse, paginatedResponse } = require('../utils/response');

exports.createProject = async (req, res, next) => {
  try {
    const project = await projectService.createProject(req.body, req.user._id);
    successResponse(res, 201, { project }, 'Project created successfully');
  } catch (error) {
    next(error);
  }
};

exports.getProjects = async (req, res, next) => {
  try {
    const { status } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await projectService.getProjects(
      req.user._id,
      { status },
      page,
      limit
    );

    paginatedResponse(res, 200, result.projects, {
      page: result.page,
      limit: result.limit,
      total: result.total
    });
  } catch (error) {
    next(error);
  }
};

exports.getProject = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.params.id, req.user._id);
    successResponse(res, 200, { project }, 'Project retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const project = await projectService.updateProject(
      req.params.id,
      req.user._id,
      req.body
    );
    successResponse(res, 200, { project }, 'Project updated successfully');
  } catch (error) {
    next(error);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    await projectService.deleteProject(req.params.id, req.user._id);
    successResponse(res, 200, null, 'Project deleted successfully');
  } catch (error) {
    next(error);
  }
};

exports.addMember = async (req, res, next) => {
  try {
    const project = await projectService.addMember(
      req.params.id,
      req.user._id,
      req.body
    );
    successResponse(res, 200, { project }, 'Member added successfully');
  } catch (error) {
    next(error);
  }
};

exports.removeMember = async (req, res, next) => {
  try {
    const project = await projectService.removeMember(
      req.params.id,
      req.user._id,
      req.params.memberId
    );
    successResponse(res, 200, { project }, 'Member removed successfully');
  } catch (error) {
    next(error);
  }
};
