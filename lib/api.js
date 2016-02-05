var fs = require("fs");
var _ = require('lodash');

var Options = require('../options');
var Common = require('./common');

var Stack = {};
var Store = {};

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
        var path = Options.contentPlace + '/' + categoryName;
        Store.getCategoryMenu = [];
        Stack.getCategoryMenu = 0;
        if (fs.existsSync(path + '/.hidden')) {
            callback(null, {});
        } else {
            try {
                _.forEach(
                    fs.readdirSync(path),
                    function (fileName) {
                        var splt = fileName.split('.');
                        if (splt[splt.length - 1] == 'html') {
                            // var file = fs.readFileSync(headFile);
                            Store.getCategoryMenu.push({filename: fileName});
                            Stack.getCategoryMenu++;
                            readFile(path + '/' + fileName, Store.getCategoryMenu.length - 1);
                        }
                    }
                );
                var interv = setInterval(
                    function () {
                        if (!Stack.getCategoryMenu) {
                            var tmp = Store.getCategoryMenu;
                            Store.getCategoryMenu = [];
                            clearInterval(interv);
                            callback(
                                null,
                                {
                                    dir: categoryName,
                                    data: tmp
                                }
                            );
                        }
                    },
                    300
                );
            } catch (e) {
                callback(null, {});
            }
        }
    }
  }

};
