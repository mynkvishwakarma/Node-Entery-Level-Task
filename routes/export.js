const express = require('express');
const router = express.Router();
const ExcelJS = require('exceljs');
const User = require('../models/User');
const Task = require('../models/Task');

router.get('/excel', async (req, res) => {
  try {
    // Fetch data
    const users = await User.query();
    const tasks = await Task.query().withGraphFetched('user');

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    
    // Users sheet
    const userSheet = workbook.addWorksheet('Users');
    userSheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Mobile', key: 'mobile', width: 15 }
    ];
    
    users.forEach(user => {
      userSheet.addRow(user);
    });

    // Tasks sheet
    const taskSheet = workbook.addWorksheet('Tasks');
    taskSheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'User ID', key: 'user_id', width: 10 },
      { header: 'User Name', key: 'user_name', width: 30 },
      { header: 'Task Name', key: 'task_name', width: 30 },
      { header: 'Status', key: 'task_type', width: 15 },
      { header: 'Last Date', key: 'last_date', width: 15 }
    ];

    tasks.forEach(task => {
      taskSheet.addRow({
        id: task.id,
        user_id: task.user_id,
        user_name: task.user ? task.user.name : 'N/A',
        task_name: task.task_name,
        task_type: task.task_type,
        last_date: task.last_date || 'N/A' 
      });
    });

    // Set headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=users_and_tasks.xlsx'
    );

    // Send file
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating Excel file');
  }
});

module.exports = router;