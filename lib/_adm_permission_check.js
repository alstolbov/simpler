var SiteOptions = require('../options/site-options');

module.exports = function (req, res, next) {
    if (req.query.hasOwnProperty(SiteOptions.admin.name) &&
        req.query.hasOwnProperty(SiteOptions.admin.pass)
    ) {
        next();
    } else {
        // next('error');
        res.redirect('/');
    }
};
