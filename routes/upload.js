var express = require("express");
var router = express.Router();


var db = require('../dbConnection');
var con = db();

router.get('/upload', function(req, res){
	var msg = "";
	var files = [];
	res.render('upload', {msg: msg, files: files});
});

router.post('/upload', function(req, res) {
  var files = [];
  if (Object.keys(req.files).length == 0) {
    return res.send('No files were uploaded.');
  } else {
		var sampleFile = req.files.sampleFile;
		var prog = req.body.program;

		if(prog == "Internet Applications and Web Development"){
			prog = 1;
		} else if(prog == "Computer Programmer Analyst"){
 		prog = 2;
 		} else {
		prog = "";
		}
		var sql = "INSERT INTO resources (name, programId) VALUES('" + sampleFile.name + "','" + prog + "');";
		con.query(sql, function(err, results){
			if(err){
				req.session.message = 'Database could not be reached: ' + err;
			}
	});

		sampleFile.mv('./public/images/' + sampleFile.name, function(err) {
			if (err){
				return res.status(500).send(err);
			}
			files.push('/images/' + sampleFile.name);
			var msg = "File upload successful! " + sampleFile.name;
			res.render('upload', {msg: msg, files: files, prog: prog});
		});
	}
});
module.exports = router;
