var express = require('express');
var app = express();
var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs')
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var path = require('path')
var port     = process.env.PORT || 8000;
var passport = require('passport')
mongoose.connect('mongodb://ajahso4:CRUCIBLE96ajah@ds163494.mlab.com:63494/iamvocal');
require('./config/passport.js')(passport);
// set up our express application
app.use(express.static('public'))
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms


app.set('view engine', 'ejs'); // set up ejs for templating

// Set the path directory for view templates

app.set('views', __dirname + '/views');

app.set('/sw.js',express.static(__dirname + '/public/sw.js'));
app.set('/manifest.json',express.static(__dirname + '/public/manifest.json'));
app.set('/style.css',express.static(__dirname + '/public/assets/custom/style.css'));
//app.set('/navbar.ejs',express.static(__dirname + '/views/includes/navbar.ejs'));
//app.use(express.static(__dirname + '/public'));

// required for passport
app.use(session({ secret: 'iwanttobevocal' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// setting up passport 
require('./config/passport.js')(passport);
// routes ======================================================================
require('./app/router.js')(app,passport,mongoose); // load our routes and pass in our app and fully configured passport


// launch ======================================================================
app.listen( port);

console.log('The magic happens on port ' + port);