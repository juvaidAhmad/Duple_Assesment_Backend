const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'member', 'viewer'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['active', 'archived', 'completed'],
    default: 'active'
  },
  color: {
    type: String,
    default: '#3B82F6'
  }
}, {
  timestamps: true
});

// Indexes
projectSchema.index({ owner: 1, status: 1 });
projectSchema.index({ 'members.user': 1 });

// Add owner to members array on creation
projectSchema.pre('save', function(next) {
  if (this.isNew && !this.members.some(m => m.user.equals(this.owner))) {
    this.members.push({ user: this.owner, role: 'owner' });
  }
  next();
});

module.exports = mongoose.model('Project', projectSchema);
