const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User');

// Add Task Form
router.get('/add', async (req, res) => {
  try {
    const users = await User.query();
    res.render('add-task', { users });
  } catch (error) {
    res.status(500).send('Error fetching users: ' + error.message);
  }
});

// Create Task
router.post('/add', async (req, res) => {
  const { userId, taskName, taskType, lastDate } = req.body; // Add lastDate

  try {
    const taskData = {
      user_id: userId,
      task_name: taskName,
      task_type: taskType
    };
    
    // Add last_date only for pending tasks
    if (taskType === 'Pending' && lastDate) {
      taskData.last_date = new Date(lastDate);
    }

    await Task.query().insert(taskData);
    res.render('success', { message: 'Task created successfully!' });
  } catch (error) {
    res.status(500).send('Error creating task: ' + error.message);
  }
});

// Get tasks for a user
router.get('/user/:id', async (req, res) => {
  try {
    const tasks = await Task.query()
      .where('user_id', req.params.id)
      .withGraphFetched('user');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// NEW: Task List Page
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.query()
      .withGraphFetched('user')
      .orderBy('created_at', 'desc');
    
    res.render('tasks', { 
      tasks,
      active: { taskList: true } 
    });
  } catch (error) {
    res.status(500).send('Error fetching tasks: ' + error.message);
  }
});

module.exports = router;