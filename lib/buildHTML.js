var fs = require("fs");
var _ = require('lodash');

var Common = require('./common');
var Options = require('../options');

function buildHtml(req, res) {
    var headHTML = '';
    var headFilePath;
    var headFile;
    var bodyHTML = '';
    var bodyFilePath;
    var bodyFile;
    var contentTypeDir;
    var contentList;
    var contentFile = '';
    var contentFileData;
    var contentHTML;
    var contentFileName;
    var isExist = false;
    var pageMeta = {};
    var contentTitle;
    var linkToFile;
    var contentDirName;

    fs.readFile('./options/site-options.js', function (err, data) {
        if (err) { res.redirect('/'); }
        var SiteOptions = JSON.parse(data.toString());

        if (req.params && req.params.category) {
            var contentDirList = fs.readdirSync(Options.contentPlace);
            _.forEach(
                contentDirList,
                function (dirName) {
                    if (dirName == req.params.category) {
                        contentTypeDir = Options.contentPlace + '/' + dirName;
                        contentDirName = dirName;
                    }
                }
            );
            // try {
            //     fs.closeSync(contentDirList);
            // } catch (e) {
            //     console.log(e);
            // }
        }
        if (!contentTypeDir) {
            contentTypeDir = Options.contentPlace + '/' + SiteOptions.defaultContentDir;
            contentDirName = SiteOptions.defaultContentDir;
        }

        contentList = [];
        try {
            _.forEach(
                fs.readdirSync(contentTypeDir),
                function (fileName) {
                    var splt = fileName.split('.');
                    if (splt[splt.length - 1] == 'html') {
                        contentList.push(fileName);
                    }
                }
            );
        } catch (e) {

        }
        if (contentList.length) {

            if (req.params && req.params.page) {
                _.forEach(
                    contentList,
                    function (artName) {
                        if (artName == req.params.page) {
                            isExist = true;
                        }
                    }
                );
                if (isExist) {
                    contentFileName = req.params.page;
                }
            } else {
                if (fs.existsSync(contentTypeDir + '/index.html')) {
                    contentFileName = 'index.html';
                } else {
                    contentFileName = contentList[Common.randomInteger(contentList.length)];
                }
            }

            if (!fs.existsSync(contentTypeDir + '/.hidden')) {

                try {
                    contentFile = fs.readFileSync(contentTypeDir + '/' + contentFileName);
                } catch (e) {
                    return res.redirect('/');
                }
                pageMeta = Common.getMeta(contentFile.toString());
                contentFileData = Common.removeMeta(contentFile.toString());
            }
        }

        contentTitle = pageMeta.contentTitle || pageMeta.title || '';
        linkToFile =
            '<a href="/' + contentDirName + '/' + contentFileName + '">' +
                '/' + contentDirName + '/' + contentFileName +
            '</a>'
        ;

        if (
            (!req.params || !req.params.page) &&
            pageMeta.split
        ) {
            contentHTML = Common.splitHTML(contentFileData);
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
        } else {
            contentHTML = contentFileData;
        }

        if (
            (!req.params || !req.params.page) &&
            pageMeta.split &&
            pageMeta.splitHead
        ) {
            headFilePath = Options.templatePlace + '/' + pageMeta.splitHead;
        } else if (pageMeta.head) {
            headFilePath = Options.templatePlace + '/' + pageMeta.head;
        } else {
            headFilePath = Options.templatePlace + '/' + SiteOptions.defaultHeadFile;
        }

        if (
            (!req.params || !req.params.page) &&
            pageMeta.split &&
            pageMeta.splitBody
        ) {
            bodyFilePath = Options.templatePlace + '/' + pageMeta.splitBody;
        } else if (pageMeta.body) {
            bodyFilePath = Options.templatePlace + '/' + pageMeta.body;
        } else {
            bodyFilePath = Options.templatePlace + '/' + SiteOptions.defaultBodyFile;
        }

        try {
            headFile = fs.readFileSync(headFilePath);
            bodyFile = fs.readFileSync(bodyFilePath);
        } catch (e) {

        }

        Common.prepareBody(bodyFile, function (body) {
            headHTML = Common.replaceTpl(
                headFile,
                {
                    title: pageMeta.title || 'HOME'
                }
            );
            bodyHTML = Common.replaceTpl(
                body,
                {
                    content_title: contentTitle,
                    link: linkToFile,
                    content: contentHTML
                }
            );

            // try {
            //     if (contentFile) {
            //         fs.closeSync(contentFile);
            //     }
            //     if (headFile) {
            //         fs.close(headFile);
            //     }
            //     if (bodyFile) {
            //         fs.closeSync(bodyFile);
            //     }
            // } catch (e) {
            //     console.log("/", e);
            // }
            res.send(
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
    });
};

module.exports = buildHtml;
