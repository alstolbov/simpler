var express = require('express');
var router = express.Router();

var buildHtml = require('./lib/buildHTML');

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
