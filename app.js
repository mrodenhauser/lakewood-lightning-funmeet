const express = require('express');
//const cookieParser = require('cookie-parser');
//const cool = require('cool-ascii-faces');
//const createError = require('http-errors');
const path = require('path');
const PORT = process.env.PORT || 5000

const indexApiRouter = require('./routes/API/index');
const eventsApiRouter = require('./routes/API/events');
const eventDefinitionsApiRouter = require('./routes/API/eventDefinitions');
const heatSheetsApiRouter = require('./routes/API/heatSheets');
const heatsApiRouter = require('./routes/API/heats');
const individualsApiRouter = require('./routes/API/individuals');
const meetsApiRouter = require('./routes/API/meets');
const teamsApiRouter = require('./routes/API/teams');

const indexRouter = require('./routes/index');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use(function(req, res, next){
//    app.locals.user = req.user;
//    next();
//});

//API
app.use('/API/', indexApiRouter);
app.use('/API/events', eventsApiRouter);
app.use('/API/eventDefinitions', eventDefinitionsApiRouter);
app.use('/API/heatSheets', heatSheetsApiRouter);
app.use('/API/heats', heatsApiRouter);
app.use('/API/individuals', individualsApiRouter);
app.use('/API/meets', meetsApiRouter);
app.use('/API/teams', teamsApiRouter);

//dynamic pages
app.use('/',indexRouter);

//static pages
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/register', (req, res) => res.render('pages/register'));
app.get('/login', (req, res) => res.render('pages/login'));
app.get('/', (req, res) => res.render('pages/login'));
app.get('/admin-home', (req, res) => res.render('pages/AdminHome'));


// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//    next(createError(404),cool());
//});

// error handler
//app.use(function(err, req, res, next) {
//    // set locals, only providing error in development
//    res.locals.message = err.message;
//    res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//    // render the error page
//    res.status(err.status || 500);
//    res.render('error');
//});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

module.exports = app;
