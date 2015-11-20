var fs = require("fs");
var _ = require('lodash');

var Common = require('./common');
var Options = require('../options');

function buildHtml(params) {
    var contentTypeDir;
    var contentList;
    var contentFile;
    var contentHTML;
    var contentFileName;
    var isExist = false;
    var pageMeta = {};

    var head = fs.readFileSync('./templates/head.html');
    var body = fs.readFileSync('./templates/body.html');
    var footer = fs.readFileSync('./templates/footer.html');

    if (params.contentType) {
        var contentDirList = fs.readdirSync(Options.contentPlace);
        _.forEach(
            contentDirList,
            function (dirName) {
                if (dirName == params.contentType) {
                    contentTypeDir = Options.contentPlace + '/' + dirName;
                }
            }
        );
    }
    if (!contentTypeDir) {
        contentTypeDir = Options.contentPlace + '/' + Options.defaultContentDir;
    }

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

    contentFile = fs.readFileSync(contentTypeDir + '/' + contentFileName).toString();
    pageMeta = Common.getMeta(contentFile);
    contentFile = Common.removeMeta(contentFile);

    if (params.split) {
        contentHTML = Common.splitHTML(contentFile);
    } else {
        contentHTML = contentFile;
    }

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
