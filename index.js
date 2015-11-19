var express = require("express");

var buildHtml = require('./lib/buildHTML');
var router = require('./routes');
var options = require('./options');

var app = express();
var port = process.env.PORT || options.port;

app.use(express.static(__dirname + '/public'));

app.use('/', router);

app.listen(port);

console.log("Server start on port", port);
