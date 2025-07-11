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


// Update the hbs creation block
const hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: 'main',
  helpers: {
    formatDate: function(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },
    
    formatDateForInput: function() {
      const today = new Date();
      return today.toISOString().split('T')[0];
    },
    
    eq: function(a, b) {
      return a === b;
    }
  }
});

app.engine('hbs', hbs.engine);
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
  res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});