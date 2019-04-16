var express = require("express");
var router = express.Router();


var db = require('../dbConnection');
var con = db();

router.get('/upload/:id', function(req, res){
	res.render('upload', { programId: req.params.id });
});

router.post('/upload/:id', function(req, res) {
	if (Object.keys(req.files).length == 0) {
		return res.send('No files were uploaded.');
	} else {
		var sampleFile = req.files.sampleFile;
		var sql = "INSERT INTO resources (name, programId) VALUES('" + sampleFile.name + "','" + req.params.id + "');";
		con.query(sql, function(err, results){
			if(err){
				req.session.message = 'Database could not be reached: ' + err;
			}
		});

		sampleFile.mv('./public/uploads/' + sampleFile.name, function(err) {
			if (err){
				return res.status(500).send(err);
			}
			req.session.message = 'You file has been uploaded.';
			res.redirect('back');
		});
	}
});
module.exports = router;
