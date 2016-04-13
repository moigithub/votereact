var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');

var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var passport = require('passport');

var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var path = require('path');


var config = {
// Server port
  port: process.env.PORT || 9000,

  // Server IP
  ip: process.env.IP || 'localhost',
  
  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    },
    uri:    process.env.MONGOLAB_URI || 'mongodb://localhost/base0'
  },
  
  secrets: {
    session:"supersecr3tl0ng_p4ssw0rd"
  }
};



// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
	console.error('MongoDB connection error: ' + err);
	process.exit(-1);
	}
);




// Setup server
var app = express();
var server = require('http').createServer(app);


// middlewares
  
 // Persist sessions with mongoStore
  // We need to enable sessions for passport twitter because its an oauth 1.0 strategy
  app.use(session({
    secret: config.secrets.session,
    resave: true,
    saveUninitialized: true,
    store: new mongoStore({
      mongooseConnection: mongoose.connection,
      db: 'base0'
    })
  }));
  
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions,, needed to populate the req.user object


  
app.use(favicon(__dirname + '/../client/public/favicon.ico'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../client/public')));




//routes

//app.get("", function(req,res){});  // basic 

  // Insert routes below
  app.use('/api/votes', require('./api/vote'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./api/auth'));
  
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(function(req, res) {
     return res.status(404).json({status:404});
   });

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(path.join(__dirname, '../client/public') + '/index.html'));
    });






// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});
