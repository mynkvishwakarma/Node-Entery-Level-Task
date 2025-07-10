require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const knex = require('knex');
const knexConfig = require('./knexfile');

// Initialize Knex
const db = knex(knexConfig.development);

// Bind Objection to Knex
const { Model } = require('objection');
Model.knex(db);

const app = express();

// Handlebars setup
app.engine('hbs', exphbs.engine({
  extname: '.hbs',
  defaultLayout: 'main'
}));
app.set('view engine', 'hbs');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// Routes
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');
const exportRoutes = require('./routes/export');

app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);
app.use('/export', exportRoutes);

// Home route
app.get('/', (req, res) => {
  res.redirect('/users/add');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});