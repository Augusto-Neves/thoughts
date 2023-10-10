const express = require('express');
const handlebars = require('express-handlebars');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('express-flash');

//Import Controllers
const ThoughtsController = require('./controllers/ThoughtsController');

//Import Routes
const thoughtsRoutes = require('./routes/thoughtsRoute');
const authRoutes = require('./routes/authRoute');

const oneDay = 1000 * 24 * 60 * 60;

const app = express();

//Models
const Thought = require('./models/Thought');
const User = require('./models/User');

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//setting assets
app.use(express.static('public'));

//Sessions
app.use(
  session({
    name: 'session',
    secret: 'thoughts_secret',
    saveUninitialized: false,
    resave: false,
    store: new FileStore({
      logFn: function () {},
      path: require('path').join(require('os').tmpdir(), 'session'),
    }),
    cookie: {
      secure: false,
      maxAge: oneDay,
      expires: new Date(Date.now() + oneDay),
      httpOnly: true,
    },
  })
);

//Flash messages
app.use(flash());

//sessions res
app.use((req, res, next) => {
  if (req.session.userId) {
    res.locals.session = req.session;
  }

  next();
});

const database = require('./db/connection');

// Routes
app.use('/thoughts', thoughtsRoutes);
app.use('/', authRoutes);

app.get('/', ThoughtsController.showThoughts);

database
  .sync()
  .then(() => {
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((err) => console.log(err));
