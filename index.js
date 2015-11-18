var fs = require("fs");
var express = require("express");
var app = express();
var port = process.env.PORT || 80;
var articlesDir = 'public/articles';

function buildHtml(res) {
    var header = fs.readFileSync('./header.html');
    var body = fs.readFileSync('./body.html').toString();

    var articles = fs.readdirSync(articlesDir);
    var articleName = articles[randomInteger(articles.length)];

    var article = fs.readFileSync(articlesDir + '/' + articleName);
    body = body.replace('{{article}}', article);
    res.send(
        '<!DOCTYPE html>' +
        '<html>' +
            '<head>' +
                header +
            '</head>' + 
            '<body>' +
                body +
            '</body>' +
        '</html>'
    );
};

function randomInteger(max) {
    var rand = Math.random() * max;
    rand = Math.floor(rand);
    return rand;
}

app.use(express.static(__dirname + '/public'));

app.get('/', function (req,res){
    buildHtml(res);
});

app.get('*', function (req,res){
    buildHtml(res);
});

app.listen(port);

console.log("Server start on port", port);
