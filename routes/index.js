var express = require('express');
var path = require ('path');
var multer = require ('multer');
var scripts = require ('../scripts.js');
var router = express.Router();

/* GET home page. */

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './public/images');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
var upload = multer({ //multer settings
    storage: storage
}).single('file');

router.post ('/file', function (req, res){
	upload (req, res, function (err){
		if (err)
			res.send ({status:'error'});
		else
			res.send ({status:'done'});
	});
});

router.post ('/process/:file', function (req, res){
    scripts.process (req.body.scripts, req.params.file, function (err, file){
        if (err)
            res.send ({status:'error'});
        else
            res.send ({status:'done', file:file});
    });
});

router.get ('/download/:filename', function(req, res) {
    console.log (__dirname+'/../public/images/'+req.params.filename);
    res.download (__dirname+'/../public/images/'+req.params.filename);
});

router.get ('/scripts', function (req, res){
    scripts.getScripts (function (err, files){
        if (err === null)
            res.send ({status:'done', files:files});
        else
            res.send ({status:'error'});
    });
});


router.get('/', function(req, res, next) {
  res.sendFile(path.resolve(__dirname + '/../public/views/index.html'));
});

module.exports = router;
