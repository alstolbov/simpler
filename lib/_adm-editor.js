var fs = require("fs");
var _ = require('lodash');
var Common = require('./common');

var Options = require('../options/site-options');

module.exports = {
  
    editFile: function (req, res, msg) {
        var HTML = fs.readFileSync('./admTemplates/adm-content-edit.html');
        var isCatExist = false;
        var isFileExist = false;

        try {
            fs.mkdirSync(Options.contentPlace + '/' + req.params.category);
        } catch(e) {

        }

        fs.closeSync(fs.openSync(Options.contentPlace + '/' + req.params.category + '/' + req.params.file, 'a'));

        var content = fs.readFileSync(Options.contentPlace + '/' + req.params.category + '/' + req.params.file).toString();

        HTML = Common.replaceTpl(
            HTML,
            {
                category: req.params.category,
                file: req.params.file,
                content: content,
                user: Options.admin.name,
                pass: Options.admin.pass,
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
        var _this = this;

        fs.writeFile(
            Options.contentPlace + '/' + req.params.category + '/' + req.params.file,
            req.body.content,
            function(err) {
                if (err) {
                    return res.send('error save');
                }
                if (req.body.fileName == req.params.file) {
                    _this.editFile(req, res, 'Done!');
                } else {
                    fs.rename(
                        Options.contentPlace + '/' + req.params.category + '/' + req.params.file,
                        Options.contentPlace + '/' + req.params.category + '/' + req.body.fileName,
                        function(err) {
                            if ( err ) {
                                _this.editFile(req, res, 'Save. No renamed.');
                            } else {
                                req.params.file = req.body.fileName;
                                _this.editFile(req, res, 'Done!');
                            }
                        }
                    );
                }
            }
        );
    },

    contentList: function (req, res) {
        var HTML = '';

        _.forEach(
            fs.readdirSync(Options.contentPlace),
            function (subDirName) {
                var subDirHTML = '';
                _.forEach(
                    fs.readdirSync(Options.contentPlace + '/' + subDirName),
                    function (fileName) {
                        subDirHTML +=
                            '<li>' +
                                '<a href="/_adm/editcontent/' + subDirName + '/' + fileName +
                                '?' + Options.admin.name + '&' + Options.admin.pass + '">' +
                                    fileName +
                                '</a>'
                            '</li>'
                        ;
                    }
                );

                HTML += '<ul><p>' + subDirName + '</p>' + subDirHTML + '</ul>';
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

    addCategory: function (req, res) {
        try {
            fs.mkdirSync(Options.contentPlace + '/' + req.params.category);
        } catch(e) {

        }

        res.redirect('/_adm/editcontent' + '?' + Options.admin.name + '&' + Options.admin.pass);
    }

};
