const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Board name is required'],
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  columns: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    order: {
      type: Number,
      required: true
    },
    color: {
      type: String,
      default: '#6B7280'
    }
  }],
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
boardSchema.index({ project: 1 });

// Default columns for new boards
boardSchema.pre('save', function(next) {
  if (this.isNew && this.columns.length === 0) {
    this.columns = [
      { name: 'To Do', order: 0, color: '#EF4444' },
      { name: 'In Progress', order: 1, color: '#F59E0B' },
      { name: 'Done', order: 2, color: '#10B981' }
    ];
  }
  next();
});

module.exports = mongoose.model('Board', boardSchema);
