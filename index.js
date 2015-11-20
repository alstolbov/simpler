var express = require("express");

var buildHtml = require('./lib/buildHTML');
var router = require('./routes');
var Options = require('./options');

var app = express();
var port = process.env.PORT || Options.port;

app.use(express.static(__dirname + '/' + Options.publicPlace));

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
