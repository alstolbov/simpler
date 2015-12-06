// var SiteOptions = require('../options/site-options');
var fs = require('fs');
module.exports = function (req, res, next) {
    fs.readFile('./options/site-options.js', function (err, data) {
        if (err) { res.redirect('/'); }
        var SiteOptions = JSON.parse(data.toString());

        if (req.query.hasOwnProperty(SiteOptions.admin.name) &&
            req.query.hasOwnProperty(SiteOptions.admin.pass)
        ) {
            req._admin = {
                name: SiteOptions.admin.name,
                pass: SiteOptions.admin.pass
            };
            next();
        } else {
            // next('error');
            res.redirect('/');
        }
    });
};
