var express = require('express');
var router = express.Router();

var buildHtml = require('./lib/buildHTML');

router.get('/', function (req,res){
    res.redirect('random');
});

router.get('/:page', function (req,res){
    buildHtml({
        res: res,
        pageName: req.params.page || false,
        contentType: 'aphorisms'
    });
});

router.get('*', function (req,res){
    buildHtml({
        res: res,
        contentType: 'aphorisms'
    });
});

module.exports = router;
