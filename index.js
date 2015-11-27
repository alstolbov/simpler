var express = require("express");
var bodyParser = require('body-parser');
var session = require('express-session');
var busboy = require('connect-busboy');

var buildHtml = require('./lib/buildHTML');
var router = require('./routes');
var Options = require('./options');

var app = express();
var port = process.env.PORT || Options.port;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(
  session(
    {
      secret: 'keyboard cat',
      cookie: {
        maxAge: 24 * 60 * 60 * 1000
      },
      resave: true,
      saveUninitialized: true
    }
  )
);

app.use(busboy());

app.use(express.static(__dirname + '/' + Options.publicPlace));

app.get('/favicon.ico', function (req, res) {
  res.status(500);
});

app.use('/', router);

app.get('*', function (req,res){
    buildHtml(req, res);
});

app.listen(port);

console.log("Server start on port", port);
