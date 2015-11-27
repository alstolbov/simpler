var express = require('express');
var router = express.Router();

var buildHtml = require('./lib/buildHTML');
var admBackups = require('./lib/_adm-backups-list');
var admEditor = require('./lib/_adm-editor');
var admSession = require('./lib/_adm_session');

var siteOptions = require('./options');

// router.get('/', function (req,res){
//     res.redirect('random');
// });

router.get('/', function (req, res){
    buildHtml(req, res);
});

//
// router.get('/' + siteOptions.adminDir + '/login', admSession.setSession, function (req, res){
//     res.send('ok');
// });

// router.get('/' + siteOptions.adminDir + '/logout', admSession.destroySession, function (req, res){
//     res.send('ok');
// });

// router.get('/' + siteOptions.adminDir + '/backups', admSession.checkSession, function (req, res){
//     admBackups.createBackup(req, res);
// });

// router.get('/' + siteOptions.adminDir + '/restore', admSession.checkSession, function (req, res){
//     admBackups.unZipForm(req, res);
// });

// router.post('/' + siteOptions.adminDir + '/restore', admSession.checkSession, function (req, res){
//     admBackups.unZip(req, res);
// });

// router.get('/' + siteOptions.adminDir + '/backups/all', admSession.checkSession, function (req, res){
//     admBackups.backupList(req, res);
// });

// router.get('/' + siteOptions.adminDir + '/backups/:fileName', admSession.checkSession, function (req, res){
//     admBackups.downloadFile(res, req.params.fileName);
// });

// router.get('/' + siteOptions.adminDir + '/:contentType', admSession.checkSession, function (req, res){
//     switch (req.params.contentType) {
//         case 'content':
//         case 'options':
//         case 'templates':
//             admEditor.contentList(req, res);
//             break;
//         case '_public':
//             req.params.contentType = 'public';
//             admEditor.contentList(req, res);
//             break;
//         default:
//             res.redirect('/');
//     }
    
// });

// router.get('/' + siteOptions.adminDir + '/content/:category/:file', admSession.checkSession, function (req, res){
//     req.params.contentType = 'content';
//     admEditor.editFile(req, res);
// });

// router.post('/' + siteOptions.adminDir + '/content/:category/:file', admSession.checkSession, function (req, res){
//     req.params.contentType = 'content';
//     admEditor.saveFile(req, res);
// });

// router.get('/' + siteOptions.adminDir + '/content/:category', admSession.checkSession, function (req, res){
//     req.params.contentType = 'content';
//     admEditor.addCategory(req, res);
// });

// router.get('/' + siteOptions.adminDir + '/templates/:category/:file', admSession.checkSession, function (req, res){
//     req.params.contentType = 'templates';
//     admEditor.editFile(req, res);
// });

// router.post('/' + siteOptions.adminDir + '/templates/:category/:file', admSession.checkSession, function (req, res){
//     req.params.contentType = 'templates';
//     admEditor.saveFile(req, res);
// });

// router.get('/' + siteOptions.adminDir + '/templates/:category', admSession.checkSession, function (req, res){
//     req.params.contentType = 'templates';
//     admEditor.addCategory(req, res);
// });

// router.get('/' + siteOptions.adminDir + '/_public/:category/:file', admSession.checkSession, function (req, res){
//     req.params.contentType = 'public';
//     admEditor.editFile(req, res);
// });

// router.post('/' + siteOptions.adminDir + '/_public/:category/:file', admSession.checkSession, function (req, res){
//     req.params.contentType = 'public';
//     admEditor.saveFile(req, res);
// });

// router.get('/' + siteOptions.adminDir + '/_public/:category', admSession.checkSession, function (req, res){
//     req.params.contentType = 'public';
//     admEditor.addCategory(req, res);
// });

// router.get('/' + siteOptions.adminDir + '/options/:file', admSession.checkSession, function (req, res){
//     req.params.contentType = 'options';
//     admEditor.editFile(req, res);
// });
// router.post('/' + siteOptions.adminDir + '/options/:file', admSession.checkSession, function (req, res){
//     req.params.contentType = 'options';
//     admEditor.saveFile(req, res);
// });
//

router.get('/:category', function (req, res){
    buildHtml(req, res);
});

router.get('/:category/:page', admSession, function (req, res){
    buildHtml(req, res);
});

router.get('/:adminDir/:contentType/:category', function (req, res){
    admSession(req, res);
});

router.get('/:adminDir/:contentType/:category/:file', function (req, res){
    admSession(req, res);
});

router.post('/:adminDir/:action', function (req, res){
    admSession(req, res);
});

router.post('/:adminDir/:contentType/:saveFile', function (req, res){
    admSession(req, res);
});

router.post('/:adminDir/:contentType/:category/:saveFile', function (req, res){
    admSession(req, res);
});

module.exports = router;
