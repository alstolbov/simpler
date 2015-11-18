var fs = require("fs");
var express = require("express");
var _ = require('lodash');

var app = express();
var port = process.env.PORT || 80;
var articlesDir = 'public/articles';

function buildHtml(res, page) {
    var header = fs.readFileSync('./header.html');
    var body = fs.readFileSync('./body.html').toString();
    var articlesList;
    var article;
    var articleName;
    var isExist = false;

    articlesList = fs.readdirSync(articlesDir);
    articleName = articlesList[randomInteger(articlesList.length)];

    if (page) {
        _.forEach(
            articlesList,
            function (artName) {
                if (artName == page) {
                    isExist = true;
                }
            }
        );
        if (isExist) {
            articleName = page;
        }
    }

    article = fs.readFileSync(articlesDir + '/' + articleName);
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
    res.redirect('random');
    // buildHtml(res);
});

app.get('/:page', function (req,res){
    buildHtml(res, req.params.page || false);
});

app.get('*', function (req,res){
    buildHtml(res);
});

app.listen(port);

console.log("Server start on port", port);
