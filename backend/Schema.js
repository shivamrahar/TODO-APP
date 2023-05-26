const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    
  },
  status: {
    type: String,
    enum: ['completed', 'pending'],
    default: 'pending'
  }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
