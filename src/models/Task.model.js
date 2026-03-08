const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    minlength: 2,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  status: {
    type: String,
    required: true,
    default: 'To Do'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dueDate: {
    type: Date,
    default: null
  },
  order: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  attachments: [{
    name: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  activityHistory: [{
    action: String,
    field: String,
    oldValue: String,
    newValue: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Indexes for efficient queries
taskSchema.index({ board: 1, status: 1, order: 1 });
taskSchema.index({ project: 1, assignedTo: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ title: 'text', description: 'text' });

// Track changes in activity history
taskSchema.pre('save', function(next) {
  if (!this.isNew && this.isModified()) {
    const modifiedFields = this.modifiedPaths();
    modifiedFields.forEach(field => {
      if (!['activityHistory', 'updatedAt'].includes(field)) {
        this.activityHistory.push({
          action: 'updated',
          field: field,
          oldValue: this._original ? this._original[field] : null,
          newValue: this[field]
        });
      }
    });
  }
  next();
});

module.exports = mongoose.model('Task', taskSchema);
