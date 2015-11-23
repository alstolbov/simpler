var fs = require("fs");
var _ = require('lodash');
var ZipZipTop = require("zip-zip-top");

var SiteOptions = require('../options.js');

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
        var textDate = date.getDay() + '-' + date.getMonth() + '-' + date.getFullYear() + '_' +
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
    }
};
