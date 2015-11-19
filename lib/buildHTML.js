var fs = require("fs");
var _ = require('lodash');

var Common = require('./common');
var Options = require('../Options');

function buildHtml(params) {
    var contentTypeDir = Options[params.contentType];
    var contentList;
    var contentHTML;
    var contentFileName;
    var isExist = false;
    var pageMeta = {};

    var head = fs.readFileSync('./templates/head.html');
    var body = fs.readFileSync('./templates/body.html');
    var footer = fs.readFileSync('./templates/footer.html');

    contentList = fs.readdirSync(contentTypeDir);
    contentFileName = contentList[Common.randomInteger(contentList.length)];

    if (params.pageName) {
        _.forEach(
            contentList,
            function (artName) {
                if (artName == params.pageName) {
                    isExist = true;
                }
            }
        );
        if (isExist) {
            contentFileName = params.pageName;
        }
    }

    contentHTML = fs.readFileSync(contentTypeDir + '/' + contentFileName).toString();

    pageMeta = Common.getMeta(contentHTML);

    head = Common.replaceTpl(
        head,
        {
            title: pageMeta.title || 'HOME'
        }
    );
    body = Common.replaceTpl(
        body,
        {
            title: pageMeta.title || 'some content',
            content: contentHTML,
            footer: footer
        }
    );

    // body = body.replace('{{content}}', contentHTML);
    params.res.send(
        '<!DOCTYPE html>' +
        '<html>' +
            '<head>' +
                head +
            '</head>' + 
            '<body>' +
                body +
            '</body>' +
        '</html>'
    );
};

module.exports = buildHtml;
