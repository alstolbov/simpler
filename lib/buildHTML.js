var fs = require("fs");
var _ = require('lodash');

var Common = require('./common');
var Options = require('../options');

function buildHtml(params) {
    var headHTML;
    var headFile;
    var bodyHTML;
    var bodyFile;
    var footerHTML;
    var footerFile;
    var contentTypeDir;
    var contentList;
    var contentFile;
    var contentHTML;
    var contentFileName;
    var categoryOptions = {};
    var isExist = false;
    var pageMeta = {};

    fs.readFile('./options/site-options.js', function (err, data) {
        if (err) { res.redirect('/'); }
        var SiteOptions = JSON.parse(data.toString());

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
            contentTypeDir = Options.contentPlace + '/' + SiteOptions.defaultContentDir;
        }

        contentList = [];
        _.forEach(
            fs.readdirSync(contentTypeDir),
            function (fileName) {
                var splt = fileName.split('.');
                if (splt[splt.length - 1] == 'html') {
                    contentList.push(fileName);
                }
                if (fileName == 'cnfg.js') {
                    categoryOptions = JSON.parse(fs.readFileSync(contentTypeDir + '/' + fileName));
                }
            }
        );
        if (!contentList.length) {
            contentFile = '';
        } else {
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
        }

        if (params.split) {
            contentHTML = Common.splitHTML(contentFile);
        } else {
            contentHTML = contentFile;
        }

        if (categoryOptions.head) {
            headFile = Options.templatePlace + '/' + categoryOptions.head;
        } else {
            headFile = Options.templatePlace + '/' + SiteOptions.defaultHeadFile;
        }

        if (categoryOptions.body) {
            bodyFile = Options.templatePlace + '/' + categoryOptions.body;
        } else {
            bodyFile = Options.templatePlace + '/' + SiteOptions.defaultBodyFile;
        }

        if (categoryOptions.footer) {
            footerFile = Options.templatePlace + '/' + categoryOptions.footer;
        } else {
            footerFile = Options.templatePlace + '/' + SiteOptions.defaultFooterFile;
        }

        headHTML = fs.readFileSync(headFile);
        bodyHTML = fs.readFileSync(bodyFile);
        footerHTML = fs.readFileSync(footerFile);        

        headHTML = Common.replaceTpl(
            headHTML,
            {
                title: pageMeta.title || 'HOME'
            }
        );
        bodyHTML = Common.replaceTpl(
            bodyHTML,
            {
                title: pageMeta.title || 'some content',
                content: contentHTML,
                footer: footerHTML
            }
        );

        // body = body.replace('{{content}}', contentHTML);
        params.res.send(
            '<!DOCTYPE html>' +
            '<html>' +
                '<head>' +
                    headHTML +
                '</head>' + 
                '<body>' +
                    bodyHTML +
                '</body>' +
            '</html>'
        );
    });
};

module.exports = buildHtml;
