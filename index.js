var express = require("express");
var bodyParser = require('body-parser')

var buildHtml = require('./lib/buildHTML');
var router = require('./routes');
var Options = require('./options');
var SiteOptions = require('./options/site-options');

var app = express();
var port = process.env.PORT || Options.port;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(__dirname + '/' + SiteOptions.publicPlace));

app.use('/', router);
app.get('*', function (req,res){
    buildHtml({
        res: res,
        contentType: SiteOptions.defaultContentDir,
        split: true
    });
});

app.listen(port);

console.log("Server start on port", port);
