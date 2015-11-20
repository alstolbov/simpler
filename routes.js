var express = require('express');
var router = express.Router();

var buildHtml = require('./lib/buildHTML');
var admBackups = require('./lib/_adm-backups-list');

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

router.get('/_adm/backups/all', function (req, res){
    res.send(admBackups.backupList());
});

router.get('/_adm/backups/create', function (req, res){
    admBackups.createBackup(res);
});

router.get('/_adm/backups/:fileName', function (req, res){
    admBackups.downloadFile(res, req.params.fileName);
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
