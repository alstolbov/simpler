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
        var resHTML =
            '<p><a href="/' + req._adminDir + '/logout">Exit</a></p>';
            '<p><a href="/' + req._adminDir + '/backups">Create</a></p>'
        ;
        _.forEach(
            backupList,
            function (fileName) {
                resHTML += '<p><a href="/' + req._adminDir + '/backups/' + fileName + '">' + fileName + '</a></p>';
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
                dir: req._adminDir
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
                    _this.removeFolder('./' + SiteOptions.publicPlace,
                        function (err) {
                            if (err) {
                                res.send(err);
                            } else {                
                                _this.removeFolder('./' + SiteOptions.templatePlace,
                                    function (err) {
                                        if (err) {
                                            res.send(err);
                                        } else {
                                            var fstream;
                                            req.pipe(req.busboy);
                                            req.busboy.on('file', function (fieldname, file, filename) {
                                                if (filename.substr(-4, 4) !== '.zip') {
                                                    res.send('error file *.zip');
                                                } else {
                                                    fstream = fsx.createWriteStream('./backups/restore_' + filename);
                                                    file.pipe(fstream);
                                                    fstream.on('close', function () {
                                                        // var AdmZip = require('adm-zip');
                                                        // var zip = new AdmZip('./backups/restore_' + filename);
                                                        // var zipEntries = zip.getEntries();
                                                        // var List = [];
                                                        // zipEntries.forEach(function(zipEntry) {
                                                        //     // console.log(zipEntry.toString()); // outputs zip entries information
                                                        //     List.push(zipEntry.entryName);
                                                        // });
                                                        // zip.extractAllTo("./", true);  
                                                        // res.json({res: List });                                                      
                                                        fs.createReadStream('./backups/restore_' + filename)
                                                            .pipe(unzip.Extract({ path: './' }))
                                                            .on('error', function (err) { res.send('error: ' + err); })
                                                            .on('close', function () { res.send('ok'); });
                                                        ;   
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

    clearBackups: function (req, res) {
        this.removeFolder(
            './backups',
            function (err) {
                if (err) {
                    res.send(err);
                } else {
                    res.send('clear');
                }
            }
        );
    },

    removeFolder: function(location, next, isNotRoot) {
        var _this = this;
        fs.readdir(location, function (err, files) {
            async.each(files, function (file, cb) {
                file = location + '/' + file
                fs.stat(file, function (err, stat) {
                    if (err) {
                        return cb(err);
                    }
                    if (stat.isDirectory()) {
                        _this.removeFolder(file, cb, true);
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
                    return next();
                } else {
                    if (isNotRoot) {
                        fs.rmdir(location, function (err) {
                            return next(err)
                        });
                    } else {
                        return next();
                    }
                }
            })
        })
    }
};
