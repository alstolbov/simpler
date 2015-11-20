var express = require('express');
var router = express.Router();

var buildHtml = require('./lib/buildHTML');
var admBackups = require('./lib/_adm-backups-list');
var admEditor = require('./lib/_adm-editor');
var admCheck = require('./lib/_adm_permission_check');

// router.get('/', function (req,res){
//     res.redirect('random');
// });

router.get('/', function (req, res){
    buildHtml({
        res: res,
        pageName: false,
        contentType: false,
        split: true
    });
});

router.get('/_adm/backups', admCheck, function (req, res){
    admBackups.createBackup(res);
});

router.get('/_adm/backups/all', admCheck, function (req, res){
    res.send(admBackups.backupList());
});

router.get('/_adm/backups/:fileName', admCheck, function (req, res){
    admBackups.downloadFile(res, req.params.fileName);
});

router.get('/_adm/editcontent', admCheck, function (req, res){
    admEditor.contentList(req, res);
});

router.get('/_adm/editcontent/:category/:file', admCheck, function (req, res){
    admEditor.editFile(req, res);
});

router.post('/_adm/editcontent/:category/:file', admCheck, function (req, res){
    admEditor.saveFile(req, res);
});

router.get('/_adm/editcontent/:category', admCheck, function (req, res){
    admEditor.addCategory(req, res);
});

router.get('/:category', function (req, res){
    buildHtml({
        res: res,
        pageName: false,
        contentType: req.params.category || false,
        split: true
    });
});

router.get('/:category/:page', function (req, res){
    buildHtml({
        res: res,
        pageName: req.params.page || false,
        contentType: req.params.category || false,
        split: false
    });
});

module.exports = router;
