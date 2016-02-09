var fs = require("fs");
var async = require('async');
var _ = require('lodash');

var Options = require('../options');
var Common = require('./common');

function readFile(fileName, index) {
    fs.readFile(
        fileName,
        function (err, fileData) {
            if (err) {
                Stack.getCategoryMenu = 0;
            } else {
                var meta = Common.getMeta(fileData.toString());
                Store.getCategoryMenu[index].contentTitle = meta.contentTitle;
                Stack.getCategoryMenu--;
            }
        }
    );
}

module.exports = {

  getCategoryMenu: function (categoryName, callback) {
    if (!categoryName) {
        callback(null, {});
    } else {
        var Store = [];
        var path = Options.contentPlace + '/' + categoryName;
        Store.getCategoryMenu = [];
        if (fs.existsSync(path + '/.hidden')) {
            callback(null, {});
        } else {
            try {
                async.map(
                    fs.readdirSync(path),
                    function (fileName, callback) {
                        var splt = fileName.split('.');
                        if (splt[splt.length - 1] == 'html') {
                            fs.readFile(
                                path + '/' + fileName,
                                function (err, fileData) {
                                    var meta = Common.getMeta(fileData.toString());
                                    Store.push({
                                        filename: fileName,
                                        contentTitle: meta.contentTitle
                                    });
                                    callback(null);
                                }
                            );
                        }
                    },
                    function (err) {
                        if (err) {
                            callback(null, {});
                        }
                        callback(null, _.sortBy(Store, 'contentTitle'));
                    }
                );
            } catch (e) {
                callback(null, {});
            }
        }
    }
  }

};
