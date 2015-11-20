var fs = require("fs");
var _ = require('lodash');
var ZipZipTop = require("zip-zip-top");

var Options = require('../options');

module.exports = {

    backupList: function () {
        var backupList = fs.readdirSync('backups');
        var res = '<p><a href="/_adm/backups/create">Create</a></p>';
        _.forEach(
            backupList,
            function (fileName) {
                res += '<p><a href="/_adm/backups/' + fileName + '"">' + fileName + '</a></p>';
            }
        );

        return res;
    },

    downloadFile: function (result, fileName) {
        return result.download('./backups/' + fileName);
    },

    createBackup: function (result) {
        var _this = this;
        var res = '<p><a href="/_adm/backups/">Back</a></p>';
        var zip4 = new ZipZipTop();
        var date = new Date();
        var textDate = date.getDay() + '-' + date.getMonth() + '-' + date.getFullYear() + '_' +
            date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds();
        ;
        zip4.zipFolder("./" + Options.publicPlace, function(err){
            if(err) {
                res += '<p>error zip ' + Options.publicPlace + '</p>';
                return result.send(res);;
            }

            zip4.zipFolder("./" + Options.contentPlace, function(err){
                if(err) {
                    res += '<p>error zip ' + Options.contentPlace  + '</p>';
                    return result.send(res);;
                }

                zip4.zipFolder("./options", function(err){
                    if(err) {
                        res += '<p>error zip options</p>';
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
    }
};
