var fs = require("fs");
var _ = require('lodash');
var Common = require('./common');

var Options = require('../options');

var themes = [
    'gray',
    'autumn',
    'mountain',
    'tibet',
    'mandala',
    'mountainIsland',
    'autumn2',
    'winter'
];

var themeFilePath = './options/themes.txt';

module.exports = {
  
    editFile: function (req, res, msg) {
        var themesData;
        if (fs.existsSync(themeFilePath)) {
            themesData = fs.readFileSync(themeFilePath);
            themes = themesData.toString().split(',');
        }
        var themeNameData = themes[Common.randomInteger(themes.length)].split('|');
        var themeName = themeNameData[0];

        var contentDirName = req.params.contentType == Options.publicPlace ?
            '_public' :
            req.params.contentType
        ;
        var HTML = fs.readFileSync('./admTemplates/adm-content-edit.html');
        var isCatExist = false;
        var isFileExist = false;
        var category = req.params.category && req.params.category !== '_root_' ?
            '/' + req.params.category :
            ''
        ;
 
        try {
            fs.mkdirSync(req.params.contentType + category);
        } catch(e) {

        }

        fs.closeSync(fs.openSync(req.params.contentType + category + '/' + req.params.file, 'a'));

        var content = fs.readFileSync(req.params.contentType + category + '/' + req.params.file).toString();

        var themeHTML = '<select id="themes">';
        _.forEach(
            themes,
            function (theme) {
                var isDefault;
                if (theme == themeName) {
                    isDefault = ' selected';
                } else {
                    isDefault = '';
                }
                var themeSplit = theme.split('|');
                themeHTML += '<option name="' + themeSplit + '"' + isDefault + '>' + (themeSplit[1] || themeSplit[0]) + '</option>';
            }
        );
        themeHTML += '</select>';

        HTML = Common.replaceTpl(
            HTML,
            {
                category: category,
                file: req.params.file,
                content: content,
                type: contentDirName,
                dir: req._adminDir,
                msg: msg || '',
                themeslist: themeHTML
            }
        );

        return res.send(
            '<!DOCTYPE html>' +
            '<html>' +
                '<head>' +
                    '<link rel="stylesheet" type="text/css" href="/css/_adm-common.css">' +
                    '<link rel="stylesheet" type="text/css" href="/css/_adm-editor.css">' +
                '</head>' + 
                '<body id="' + themeName + '">' +
                    HTML +
                '</body>' +
            '</html>'
        );
    },

    saveFile: function (req, res) {
        var contentDirName = req.params.contentType;
        var _this = this;
        var category = req.params.category ?
            '/' + req.params.category :
            ''
        ;

        fs.writeFile(
            req.params.contentType + category + '/' + req.params.saveFile,
            req.body.content,
            function(err) {
                if (err) {
                    return res.send('error save');
                }
                if (req.body.fileName == req.params.saveFile) {
                    // _this.editFile(req, res, 'Done!');
                    if (category == '') {
                        res.redirect('/' + req._adminDir + '/' + contentDirName);
                    }
                } else {
                    fs.rename(
                        req.params.contentType + category + '/' + req.params.saveFile,
                        req.params.contentType + category + '/' + req.body.fileName,
                        function(err) {
                            if ( err ) {
                                _this.editFile(req, res, 'Save. No renamed.');
                            } else {
                                req.params.saveFile = req.body.fileName;
                                // _this.editFile(req, res, 'Done!');
                                if (category == '') {
                                    res.redirect('/' + req._adminDir + '/' + contentDirName);
                                }
                            }
                        }
                    );
                }
            }
        );
    },

    _getContentHTML: function (req, subDir) {
        var _this = this;
        var contentDirName = req.params.contentType == Options.publicPlace ?
            '_public' :
            req.params.contentType
        ;
        var subDirHTML = '';
        var subDirName = subDir ?
            '/' + subDir :
            ''
        ;
        _.forEach(
            fs.readdirSync(req.params.contentType + subDirName),
            function (fileName) {
                subDirHTML += _this._getLink(fileName, req._adminDir + '/' + contentDirName, subDir);
            }
        );

        return subDirHTML;
    },

    _getLink: function (fileName, rootDir, subDir) {
        var subDirNameHTML = subDir ?
            '/' + subDir :
            '/_root_'
        ;
        var res =  '<li>' +
                        '<a href="/' + rootDir + subDirNameHTML + '/' + fileName +
                        '">' +
                            fileName +
                        '</a>'
                    '</li>'
        ;
        return res;
    },

    contentList: function (req, res) {
        var _this = this;
        var HTML = '<p><a href="/' + req._adminDir + '/logout">Exit</a></p>';
        var HTML2 = '';
        var subDirList = [];

        try {
            _.forEach(
                fs.readdirSync(req.params.contentType),
                function (subDirName) {
                    if (fs.lstatSync('./' + req.params.contentType + '/' + subDirName).isDirectory()) {
                        HTML += '<ul><p>' + subDirName + '</p>' + _this._getContentHTML(req, subDirName) + '</ul>';
                    } else {
                        HTML2 += '<ul>' +_this._getLink(subDirName, req._adminDir + '/' + req.params.contentType) + '</ul>';
                    }
                }
            );
        } catch (err) {
            HTML += '<ul><p>' + req.params.contentType + '</p>' + _this._getContentHTML(req) + '</ul>';
        }

        return res.send(
            '<!DOCTYPE html>' +
            '<html>' +
                '<head>' +
                    '<link rel="stylesheet" type="text/css" href="/css/_adm-common.css">' +
                '</head>' + 
                '<body>' +
                    HTML +
                    HTML2 +
                '</body>' +
            '</html>'
        );
    },

    addCategory: function (req, res) {
        var contentDirName = req.params.contentType == Options.publicPlace ?
            '_public' :
            req.params.contentType
        ;
        try {
            fs.mkdirSync(req.params.contentType + '/' + req.params.category);
        } catch(e) {

        }

        res.redirect('/' + req._adminDir + '/' + contentDirName);
    }

};
