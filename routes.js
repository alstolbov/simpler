var express = require('express');
var router = express.Router();

var buildHtml = require('./lib/buildHTML');
var admBackups = require('./lib/_adm-backups-list');
var admEditor = require('./lib/_adm-editor');
var admSession = require('./lib/_adm_session');
var Api = require('./lib/api');

var siteOptions = require('./options');

// router.get('/', function (req,res){
//     res.redirect('random');
// });

router.get('/', function (req, res){
    buildHtml(req, res);
});

router.get('/_api/:category', function (req, res){
    Api.getCategoryMenu(
        req.params.category,
        function (err, data) {
            res.json(data || err);
        }
    );
});

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
