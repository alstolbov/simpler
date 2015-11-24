var fs = require("fs");
var _ = require('lodash');
var Common = require('./common');

var Options = require('../options');

module.exports = {
  
    editFile: function (req, res, msg) {
        var contentDirName = req.params.contentType == Options.publicPlace ?
            '_public' :
            req.params.contentType
        ;
        var HTML = fs.readFileSync('./admTemplates/adm-content-edit.html');
        var isCatExist = false;
        var isFileExist = false;
        var category = req.params.category ?
            '/' + req.params.category :
            ''
        ;
 
        try {
            fs.mkdirSync(req.params.contentType + category);
        } catch(e) {

        }

        fs.closeSync(fs.openSync(req.params.contentType + category + '/' + req.params.file, 'a'));

        var content = fs.readFileSync(req.params.contentType + category + '/' + req.params.file).toString();

        HTML = Common.replaceTpl(
            HTML,
            {
                category: category,
                file: req.params.file,
                content: content,
                type: contentDirName,
                user: req._admin.name,
                pass: req._admin.pass,
                dir: Options.adminDir,
                msg: msg || ''
            }
        );

        return res.send(
            '<!DOCTYPE html>' +
            '<html>' +
                '<head>' +
                '</head>' + 
                '<body>' +
                    HTML +
                '</body>' +
            '</html>'
        );
    },

    saveFile: function (req, res) {
        var contentDirName = req.params.contentType == Options.publicPlace ?
            '_public' :
            req.params.contentType
        ;
        var _this = this;
        var category = req.params.category ?
            '/' + req.params.category :
            ''
        ;
        fs.writeFile(
            req.params.contentType + category + '/' + req.params.file,
            req.body.content,
            function(err) {
                if (err) {
                    return res.send('error save');
                }
                if (req.body.fileName == req.params.file) {
                    // _this.editFile(req, res, 'Done!');
                   res.redirect('/' + Options.adminDir + '/' + contentDirName + '?' + req._admin.name + '&' + req._admin.pass);
                } else {
                    fs.rename(
                        req.params.contentType + category + '/' + req.params.file,
                        req.params.contentType + category + '/' + req.body.fileName,
                        function(err) {
                            if ( err ) {
                                _this.editFile(req, res, 'Save. No renamed.');
                            } else {
                                req.params.file = req.body.fileName;
                                // _this.editFile(req, res, 'Done!');
                                res.redirect('/_adm/' + contentDirName + '?' + req._admin.name + '&' + req._admin.pass);
                            }
                        }
                    );
                }
            }
        );
    },

    _getContentHTML: function (req, subDir) {
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
                subDirHTML +=
                    '<li>' +
                        '<a href="/' + Options.adminDir + '/' + contentDirName + subDirName + '/' + fileName +
                        '?' + req._admin.name + '&' + req._admin.pass + '">' +
                            fileName +
                        '</a>'
                    '</li>'
                ;
            }
        );

        return subDirHTML;
    },

    contentList: function (req, res) {
        var _this = this;
        var HTML = '';
        var subDirList = [];
        try {
            _.forEach(
                fs.readdirSync(req.params.contentType),
                function (subDirName) {
                    var subDirHTML = _this._getContentHTML(req, subDirName);
                    HTML += '<ul><p>' + subDirName + '</p>' + subDirHTML + '</ul>';
                }
            );
        } catch (err) {
            HTML += '<ul><p>' + req.params.contentType + '</p>' + _this._getContentHTML(req) + '</ul>';
        }

        return res.send(
            '<!DOCTYPE html>' +
            '<html>' +
                '<head>' +
                '</head>' + 
                '<body>' +
                    HTML +
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

        res.redirect('/' + Options.adminDir + '/' + contentDirName + '?' + req._admin.name + '&' + req._admin.pass);
    }

};
