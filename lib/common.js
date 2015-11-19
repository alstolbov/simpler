var _ = require('lodash');
var Opt = require('../options');

module.exports = {

    randomInteger: function (max) {
        var rand = Math.random() * max;
        rand = Math.floor(rand);
        return rand;
    },

    getMeta: function (str) {
        var markerStart = Opt.tags.metaStart;
        var markerEnd = Opt.tags.metaStop;
        var meta = false;
        if (str.indexOf(markerStart) + 1) {
            meta = JSON.parse(
                str.substring(
                    str.indexOf(markerStart) + markerStart.length,
                    str.indexOf(markerEnd)
                )
            );
        }

        return meta;
    },

    removeMeta: function (str) {
        var res = str;
        if (typeof res !== 'string') {
            res.toString();
        }

        return this.cutEnd(res, Opt.tags.metaStart);
    },

    cutEnd: function (str, ext) {
        var res = str;
        if (str.indexOf(ext) + 1) {
            res = str.substring(
                0,
                str.indexOf(ext)
            );
        }

        return res;
    },

    replaceTplVar: function (str, find, replace, unIgnoreCaseRules) { 
        var ignoreCase = unIgnoreCaseRules || true;
        var _token;
        var token = find;
        var newToken = replace;
        var i = -1;

        if ( typeof token === "string" ) {

            if ( ignoreCase ) {

                _token = token.toLowerCase();

                while( (
                    i = str.toLowerCase().indexOf(
                        token, i >= 0 ? i + newToken.length : 0
                    ) ) !== -1
                ) {
                    str = str.substring( 0, i ) +
                        newToken +
                        str.substring( i + token.length );
                }

            } else {
                return this.split( token ).join( newToken );
            }

        }
        return str;
    },

    replaceTpl: function (str, tplObj) {
        var _this = this;
        var res = str.toString();
        if (typeof res !== 'string') {
            res.toString();
        }
        _.forEach(
            tplObj,
            function (value, tplVarName) {
                var tplVar = '{{' + tplVarName + '}}';
                if (res.indexOf(tplVar) + 1) {
                    res = _this.replaceTplVar(res, tplVar, value);
                }
            }
        );
        return res;
    },

    splitHTML: function (str) {
        var marker = Opt.tags.sectSplit;
        var res = str;
        if (typeof res !== 'string') {
            res.toString();
        }

        if (res.indexOf(marker) + 1) {
            res = res.split(marker);
            res = res[this.randomInteger(res.length)];
        } 

        return res;
    }

};
