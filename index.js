var express = require("express");
var bodyParser = require('body-parser')

var buildHtml = require('./lib/buildHTML');
var router = require('./routes');
var Options = require('./options');

var app = express();
var port = process.env.PORT || Options.port;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(__dirname + '/' + Options.publicPlace));

app.get('/favicon.ico', function (req, res) {
  res.status(500);
});

app.use('/', router);

app.get('*', function (req,res){
    buildHtml({
        res: res,
        contentType: Options.defaultContentDir,
        split: true
    });
});

app.listen(port);

console.log("Server start on port", port);
