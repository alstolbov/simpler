var express = require('express');
var router = express.Router();

var buildHtml = require('./lib/buildHTML');
var admBackups = require('./lib/_adm-backups-list');
var admEditor = require('./lib/_adm-editor');
var admCheck = require('./lib/_adm_permission_check');

var siteOptions = require('./options');

// router.get('/', function (req,res){
//     res.redirect('random');
// });

// router.get('/asd/asd/asd', function (req, res){
//     var fs = require('fs');
//     var Decompress = require('decompress');
//     // var readStream = fs.createReadStream('./backups/1-10-2015_12-26-18.zip');
//     Decompress({mode: '755'})
//     .src('./backups/1-10-2015_12-26-18.zip')
//     .dest('./')
//     .use(Decompress.zip({strip: 1}))
//     .run();
// });

router.get('/', function (req, res){
    buildHtml({
        res: res,
        pageName: false,
        contentType: false,
        split: true
    });
});

router.get('/' + siteOptions.adminDir + '/backups', admCheck, function (req, res){
    admBackups.createBackup(req, res);
});

router.get('/' + siteOptions.adminDir + '/restore', admCheck, function (req, res){
    admBackups.unZipForm(req, res);
});

router.post('/' + siteOptions.adminDir + '/restore', admCheck, function (req, res){
    admBackups.unZip(req, res);
});

router.get('/' + siteOptions.adminDir + '/backups/all', admCheck, function (req, res){
    admBackups.backupList(req, res);
});

router.get('/' + siteOptions.adminDir + '/backups/:fileName', admCheck, function (req, res){
    admBackups.downloadFile(res, req.params.fileName);
});

router.get('/' + siteOptions.adminDir + '/:contentType', admCheck, function (req, res){
    switch (req.params.contentType) {
        case 'content':
        case 'options':
        case 'templates':
            admEditor.contentList(req, res);
            break;
        default:
            res.redirect('/');
    }
    
});

router.get('/' + siteOptions.adminDir + '/content/:category/:file', admCheck, function (req, res){
    req.params.contentType = 'content';
    admEditor.editFile(req, res);
});

router.post('/' + siteOptions.adminDir + '/content/:category/:file', admCheck, function (req, res){
    req.params.contentType = 'content';
    admEditor.saveFile(req, res);
});

router.get('/' + siteOptions.adminDir + '/content/:category', admCheck, function (req, res){
    req.params.contentType = 'content';
    admEditor.addCategory(req, res);
});

router.get('/' + siteOptions.adminDir + '/templates/:category/:file', admCheck, function (req, res){
    req.params.contentType = 'templates';
    admEditor.editFile(req, res);
});

router.post('/' + siteOptions.adminDir + '/templates/:category/:file', admCheck, function (req, res){
    req.params.contentType = 'templates';
    admEditor.saveFile(req, res);
});

router.get('/' + siteOptions.adminDir + '/templates/:category', admCheck, function (req, res){
    req.params.contentType = 'templates';
    admEditor.addCategory(req, res);
});

router.get('/' + siteOptions.adminDir + '/options/:file', admCheck, function (req, res){
    req.params.contentType = 'options';
    admEditor.editFile(req, res);
});
router.post('/' + siteOptions.adminDir + '/options/:file', admCheck, function (req, res){
    req.params.contentType = 'options';
    admEditor.saveFile(req, res);
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
