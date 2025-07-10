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
  const { userId, taskName, taskType } = req.body;

  try {
    await Task.query().insert({
      user_id: userId,
      task_name: taskName,
      task_type: taskType
    });
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

module.exports = router;