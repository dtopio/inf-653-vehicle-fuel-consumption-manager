require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const { engine } = require('express-handlebars');

const webRoutes = require('./routes/webRoutes');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

// View Engine Setup
app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  helpers: {
    eq: (a, b) => a === b,
    firstChar: (str) => (str && str.length > 0) ? str[0].toUpperCase() : '?',
    sumField: (arr, field) => {
      if (!Array.isArray(arr)) return '0.00';
      return arr.reduce((sum, item) => sum + Number(item[field] || 0), 0).toFixed(2);
    }
  }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Expose session user to all templates
app.use((req, res, next) => {
  res.locals.username = (req.session && req.session.username) || null;
  next();
});

// Routes
app.use('/', webRoutes);
app.use('/api', apiRoutes);

app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).send('Invalid CSRF token');
  }

  return next(err);
});

const PORT = process.env.PORT || 3000;
function startServer(port, attemptsLeft = 5) {
  const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE' && attemptsLeft > 0) {
      const nextPort = Number(port) + 1;
      console.warn(`Port ${port} is in use. Retrying on port ${nextPort}...`);
      startServer(nextPort, attemptsLeft - 1);
      return;
    }

    throw error;
  });
}

startServer(PORT);
