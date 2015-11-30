var fs = require("fs");
var _ = require('lodash');

var Common = require('./common');
var Options = require('../options');

function buildHtml(req, res) {
    var headHTML = '';
    var headFile;
    var bodyHTML = '';
    var bodyFile;
    var footerHTML = '';
    var footerFile;
    var contentTypeDir;
    var contentList;
    var contentFile = '';
    var contentHTML;
    var contentFileName;
    var isExist = false;
    var pageMeta = {};
    var contentTitleSplit;
    var contentTitleNoSplit;
    var linkForSplitFile;
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
                    contentFile = fs.readFileSync(contentTypeDir + '/' + contentFileName).toString();
                } catch (e) {
                    return res.redirect('/');
                }
                pageMeta = Common.getMeta(contentFile);
                contentFile = Common.removeMeta(contentFile);
            }
        }

        if (
            (!req.params || !req.params.page) &&
            pageMeta.split
        ) {
            contentHTML = Common.splitHTML(contentFile);
            contentTitleSplit = pageMeta.contentTitle || pageMeta.title || '';
            contentTitleNoSplit = '';
            linkForSplitFile =
                '<a href="/' + contentDirName + '/' + contentFileName + '">' +
                    '/' + contentDirName + '/' + contentFileName +
                '</a>'
            ;
        } else {
            contentHTML = contentFile;
            contentTitleSplit = '';
            contentTitleNoSplit = pageMeta.contentTitle || pageMeta.title || '';
            linkForSplitFile = '';
        }

        if (pageMeta.head) {
            headFile = Options.templatePlace + '/' + pageMeta.head;
        } else {
            headFile = Options.templatePlace + '/' + SiteOptions.defaultHeadFile;
        }

        if (pageMeta.body) {
            bodyFile = Options.templatePlace + '/' + pageMeta.body;
        } else {
            bodyFile = Options.templatePlace + '/' + SiteOptions.defaultBodyFile;
        }

        if (pageMeta.footer) {
            footerHTML = fs.readFileSync(Options.templatePlace + '/' + pageMeta.footer);
        } else {
            footerHTML = '';
        }

        try {
            headHTML = fs.readFileSync(headFile);
            bodyHTML = fs.readFileSync(bodyFile);
        } catch (e) {

        }

        headHTML = Common.replaceTpl(
            headHTML,
            {
                title: pageMeta.title || 'HOME'
            }
        );
        bodyHTML = Common.replaceTpl(
            bodyHTML,
            {
                content_title_split: contentTitleSplit,
                content_title_no_split: contentTitleNoSplit,
                link: linkForSplitFile,
                content: contentHTML,
                footer: footerHTML
            }
        );

        // body = body.replace('{{content}}', contentHTML);
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
};

module.exports = buildHtml;
