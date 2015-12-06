var fs = require('fs');
var md5 = require('md5');
var _ = require('lodash');

var admBackups = require('./_adm-backups-list.js');
var admEditor = require('./_adm-editor');

var setSession = function (SiteOptions, req, res, next) {
    var isLogin = false;
    var isPassword = false;

    _.forEach(
        req.query,
        function (val, key) {
            if (md5(key) == SiteOptions.admin.name && !isLogin) {
                isLogin = true;
            }
            if (md5(key) == SiteOptions.admin.pass && !isPassword) {
                isPassword = true;
            }
        }
    );

    if (isLogin && isPassword) {
        req.session.isAdmin = true;
        loginRouter(req, res);
    } else {
        res.redirect('/');
    }
};

var destroySession = function (req, res) {
    req.session.destroy();
    res.redirect('/');
};

var checkSession = function (req, res, _next) {
    var next = _next || false;
    fs.readFile('./options/site-options.js', function (err, data) {
        if (err) { res.redirect('/'); }
        var SiteOptions = JSON.parse(data.toString());
        var adminDir = req.params.adminDir || req.params.category;
        if (md5(adminDir) !== SiteOptions.adminDir) {
            if (next) {
                next();
            } else {
                res.redirect('/');
            }
        } else {
            if (!req.session.isAdmin) {
                setSession(SiteOptions, req, res);
            } else {
                loginRouter(req, res, next);
            }
        }
    });
}

var loginRouter = function (req, res) {
    var isEdit;
    req._adminDir = req.params.adminDir || req.params.category;
    if (req.params.file) {
        isEdit = false;
        switch (req.params.contentType) {
            case '_public':
                req.params.contentType = 'public';
                isEdit = true;
                break;
            case 'templates':
            case 'content':
                isEdit = true;
                break;
            case 'options':
                req.params.category = false;
                isEdit = true;
                break;
        }
        if (isEdit) {
            admEditor.editFile(req, res);
        }
    } else if (req.params.category && req.params.contentType) {
        isEdit = false;
        switch (req.params.contentType) {
            case '_public':
                req.params.contentType = 'public';
                isEdit = true;
                break;
            case 'templates':
            case 'content':
                isEdit = true;
                break;
            case 'backups':
                if (req.params.category == 'all') {
                    admBackups.backupList(req, res);
                } else {
                    admBackups.downloadFile(res, req.params.category);
                }
                break;
        }
        if (isEdit) {
            admEditor.addCategory(req, res);
        }
    }

    if (req.params.page && req.params.category) {
        isEdit = false;
        switch (req.params.page) {
            case '_public':
                req.params.contentType = 'public';
                isEdit = true;
                break;
            case 'templates':
            case 'content':
            case 'options':
                req.params.contentType = req.params.page;
                isEdit = true;
                break;
            case 'login':
                res.redirect('/' + req._adminDir + '/content');
                break;
            case 'logout':
                destroySession(req, res);
                break;
            case 'backups':
                admBackups.createBackup(req, res);
                break;
            case 'restore':
                admBackups.unZipForm(req, res);
                break;
            case 'clearBackups':
                admBackups.clearBackups(req, res);
                break;
            case 'logout':
                destroySession(req, res);
                break;
        }
        if (isEdit) {
            admEditor.contentList(req, res);
        }
    }

    if (req.params.saveFile) {
        isEdit = false;
        switch (req.params.contentType) {
            case 'public':
                // req.params.contentType = 'public';
                isEdit = true;
                break;
            case 'templates':
            case 'content':
                isEdit = true;
                break;
            case 'options':
                req.params.category = false;
                isEdit = true;
                break;
        }
        if (isEdit) {
            admEditor.saveFile(req, res);
        }
    }

    if (req.params.action) {
        switch (req.params.action) {
            case 'restore':
                admBackups.unZip(req, res);
                break;
        }
    }
};

module.exports = checkSession;
