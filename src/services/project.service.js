const Project = require('../models/Project.model');
const Board = require('../models/Board.model');
const { AppError } = require('../utils/errors');

class ProjectService {
  async createProject(projectData, userId) {
    const project = await Project.create({
      ...projectData,
      owner: userId
    });

    // Create default board
    await Board.create({
      name: 'Main Board',
      project: project._id,
      isDefault: true
    });

    return await project.populate('owner', 'name email avatar');
  }

  async getProjects(userId, filters = {}, page = 1, limit = 10) {
    const query = {
      $or: [
        { owner: userId },
        { 'members.user': userId }
      ]
    };

    if (filters.status) query.status = filters.status;

    const skip = (page - 1) * limit;
    const projects = await Project.find(query)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Project.countDocuments(query);

    return { projects, total, page, limit };
  }

  async getProjectById(projectId, userId) {
    const project = await Project.findById(projectId)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    // Check access with proper string comparison
    const userIdStr = userId.toString();
    const ownerIdStr = project.owner._id.toString();
    const isMember = project.members.some(m => m.user._id.toString() === userIdStr);

    if (ownerIdStr !== userIdStr && !isMember) {
      throw new AppError('Access denied', 403);
    }

    return project;
  }

  async updateProject(projectId, userId, updateData) {
    const project = await Project.findById(projectId);
    
    if (!project) {
      throw new AppError('Project not found', 404);
    }

    this.checkAdminAccess(project, userId);

    Object.assign(project, updateData);
    await project.save();

    return await project.populate('owner members.user', 'name email avatar');
  }

  async deleteProject(projectId, userId) {
    const project = await Project.findById(projectId);
    
    if (!project) {
      throw new AppError('Project not found', 404);
    }

    if (project.owner.toString() !== userId.toString()) {
      throw new AppError('Only project owner can delete the project', 403);
    }

    await project.deleteOne();
  }

  async addMember(projectId, userId, memberData) {
    const project = await Project.findById(projectId);
    
    if (!project) {
      throw new AppError('Project not found', 404);
    }

    this.checkAdminAccess(project, userId);

    const memberExists = project.members.some(
      m => m.user.toString() === memberData.userId
    );

    if (memberExists) {
      throw new AppError('User is already a member', 400);
    }

    project.members.push({
      user: memberData.userId,
      role: memberData.role || 'member'
    });

    await project.save();
    return await project.populate('members.user', 'name email avatar');
  }

  async removeMember(projectId, userId, memberId) {
    const project = await Project.findById(projectId);
    
    if (!project) {
      throw new AppError('Project not found', 404);
    }

    this.checkAdminAccess(project, userId);

    if (project.owner.toString() === memberId) {
      throw new AppError('Cannot remove project owner', 400);
    }

    project.members = project.members.filter(
      m => m.user.toString() !== memberId
    );

    await project.save();
    return project;
  }

  checkMemberAccess(project, userId) {
    const userIdStr = userId.toString();
    const isOwner = project.owner._id ? project.owner._id.toString() === userIdStr : project.owner.toString() === userIdStr;
    const isMember = project.members.some(m => {
      const memberId = m.user._id ? m.user._id.toString() : m.user.toString();
      return memberId === userIdStr;
    });

    if (!isOwner && !isMember) {
      throw new AppError('Access denied', 403);
    }
  }

  checkAdminAccess(project, userId) {
    const userIdStr = userId.toString();
    const isOwner = project.owner._id ? project.owner._id.toString() === userIdStr : project.owner.toString() === userIdStr;
    
    const member = project.members.find(m => {
      const memberId = m.user._id ? m.user._id.toString() : m.user.toString();
      return memberId === userIdStr;
    });
    
    const isAdmin = isOwner || (member && ['owner', 'admin'].includes(member.role));

    if (!isAdmin) {
      throw new AppError('Admin access required', 403);
    }
  }
}

module.exports = new ProjectService();
