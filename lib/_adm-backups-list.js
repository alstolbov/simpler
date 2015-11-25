var fs = require("fs");
var fsx = require('fs-extra');
var _ = require('lodash');
var unzip = require('unzip');
var ZipZipTop = require("zip-zip-top");
var async = require('async');

var SiteOptions = require('../options');
var Common = require('./common');

module.exports = {

    backupList: function (req, res) {
        var backupList = fs.readdirSync('backups');
        var resHTML = '<p><a href="/' + SiteOptions.adminDir + '/backups?' + req._admin.name + '&' + req._admin.pass + '">Create</a></p>';
        _.forEach(
            backupList,
            function (fileName) {
                resHTML += '<p><a href="/' + SiteOptions.adminDir + '/backups/' + fileName + '?' + req._admin.name + '&' + req._admin.pass + '">' + fileName + '</a></p>';
            }
        );

        return res.send(resHTML);
    },

    downloadFile: function (res, fileName) {
        return res.download('./backups/' + fileName);
    },

    createBackup: function (req, result) {
        var _this = this;
        var res = '<p><a href="/' + SiteOptions.adminDir + '/backups/">Back</a></p>';
        var zip4 = new ZipZipTop();
        var date = new Date();
        var textDate = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + '_' +
            date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds();
        ;
        zip4.zipFolder("./" + SiteOptions.publicPlace, function(err){
            if(err) {
                res += '<p>error zip ' + SiteOptions.publicPlace + '</p>';
                return result.send(res);;
            }

            zip4.zipFolder("./" + SiteOptions.contentPlace, function(err){
                if(err) {
                    res += '<p>error zip ' + SiteOptions.contentPlace  + '</p>';
                    return result.send(res);
                }

                zip4.zipFolder("./" + SiteOptions.templatePlace, function(err){
                    if(err) {
                        res += '<p>error zip ' + SiteOptions.templatePlace  + '</p>';
                        return result.send(res);
                    }

                    zip4.zipFolder("./options", function(err){
                        if(err) {
                            res += '<p>error zip SiteOptions</p>';
                            return result.send(res);;
                        }

                        zip4.writeToFile("./backups/" + textDate + ".zip", function(err) {
                            if(err) {
                                res += '<p>error finaly zip</p>';
                                return result.send(res);;
                            }
                            res += "<p>" + textDate + ".zip save!</p>";

                            return _this.downloadFile(result, textDate + '.zip');
                        });
                    });
                });
            });
        });
    },

    unZipForm: function (req, res) {
        var HTML = fs.readFileSync('./admTemplates/adm-upload.html');
         HTML = Common.replaceTpl(
            HTML,
            {
                user: req._admin.name,
                pass: req._admin.pass,
                dir: SiteOptions.adminDir
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

    unZip: function (req, res) {
        var _this = this;
        this.removeFolder('./' + SiteOptions.contentPlace,
            function (err) {
                if (err) {
                    res.send(err);
                } else {
                    _this.removeFolder('./' +  + SiteOptions.publicPlace,
                        function (err) {
                            if (err) {
                                res.send(err);
                            } else {                
                                _this.removeFolder('./' +  + SiteOptions.templatePlace,
                                    function (err) {
                                        if (err) {
                                            res.send(err);
                                        } else {
                                            var fstream;
                                            req.pipe(req.busboy);
                                            req.busboy.on('file', function (fieldname, file, filename) {
                                                console.log(filename.substr(-4, 4));
                                                if (filename.substr(-4, 4) !== '.zip') {
                                                    res.send('error file *.zip');
                                                } else {
                                                    fstream = fsx.createWriteStream('./backups/restore_' + filename);
                                                    file.pipe(fstream);
                                                    fstream.on('close', function () {
                                                        fs.createReadStream('./backups/restore_' + filename).pipe(unzip.Extract({ path: './' }));             
                                                        res.send('ok');
                                                    });
                                                }
                                            });
                                        }
                                    }
                                );
                            }
                        }
                    );
                }
            }
        );
    },

    removeFolder: function(location, next) {
        var _this = this;
        fs.readdir(location, function (err, files) {
            async.each(files, function (file, cb) {
                file = location + '/' + file
                fs.stat(file, function (err, stat) {
                    if (err) {
                        return cb(err);
                    }
                    if (stat.isDirectory()) {
                        _this.removeFolder(file, cb);
                    } else {
                        fs.unlink(file, function (err) {
                            if (err) {
                                return cb(err);
                            }
                            return cb();
                        })
                    }
                })
            }, function (err) {
                if (err) return next(err)
                if (location == './NaN') {
                    return next(err);
                } else {
                    fs.rmdir(location, function (err) {
                        console.log(location);
                        return next(err)
                    });
                }
            })
        })
    }
};
