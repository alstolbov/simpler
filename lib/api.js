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
                Stack.getCategoryMeny = 0;
            } else {
                var meta = Common.getMeta(fileData.toString());
                Store.getCategoryMeny[index].contentTitle = meta.contentTitle;
                Stack.getCategoryMeny--;
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
        Store.getCategoryMeny = [];
        Stack.getCategoryMeny = 0;
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
                            Store.getCategoryMeny.push({filename: fileName});
                            Stack.getCategoryMeny++;
                            readFile(path + '/' + fileName, Store.getCategoryMeny.length - 1);
                        }
                    }
                );
                var interv = setInterval(
                    function () {
                        if (!Stack.getCategoryMeny) {
                            var tmp = Store.getCategoryMeny;
                            Store.getCategoryMeny = [];
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
