var express = require("express");
var router = express.Router();

var db = require('../dbConnection');
var con = db();

router.get("/admin", isLoggedIn, isAdmin, function(req, res){
	con.query("SELECT * FROM programs ORDER BY programCode DESC", function(err,result){
		res.render('admin/index',{ items: result });
	});
	//maybe change this to pass both schools and programs?
	// or do it with ajax?
});
router.get('/admin/program/add', isLoggedIn, isAdmin, function(req,res){
	res.render('admin/add-program.ejs');
});
router.post('/admin/program/add', isLoggedIn, isAdmin, function(req,res){
	var qry = "INSERT INTO programs(programCode,programName,programLength,tuitionDomestic,tuitionInternational,isCoOp, overallRating, degreeType) VALUES (";
	qry+= "'" +req.body.programCode+"',";
	qry+= "'" +req.body.programName+"',";
	qry+= "'" +req.body.programLength+"',";
	qry+= "'" +req.body.tuitionDomestic+"',";
	qry+= "'" +req.body.tuitionInternational+"',";
	qry+= "'" +req.body.isCoOp+"',";
	qry+= "'" +req.body.overallRating+"',";
	qry+= "'" +req.body.degreeType+"');";

	con.query(qry,function(err,result){
		if(err){
			console.log(err);
		} else {
			req.session.message = "Program Successfully Added";
			res.redirect('back');
		}
	});
});
router.get('/admin/program/edit/:program_id', isLoggedIn, isAdmin, function(req,res){
	con.query("SELECT * FROM programs WHERE programId = '" + req.params.program_id +"'", function (req,result){
		res.render('admin/edit-program.ejs', {items: result});
	});
});
router.post('/admin/program/edit/:program_id', isLoggedIn, isAdmin, function(req,res){
	var qry = "UPDATE programs SET  ";
	qry+= "programCode='" +req.body.programCode+"',";
	qry+= "programName='" +req.body.programName+"',";
	qry+= "programLength='" +req.body.programLength+"',";
	qry+= "tuitionDomestic='" +req.body.tuitionDomestic+"',";
	qry+= "tuitionInternational='" +req.body.tuitionInternational+"',";
	qry+= "isCoOp='" +req.body.isCoOp+"',";
	qry+= "overallRating='" +req.body.overallRating+"',";
	qry+= "degreeType='" +req.body.degreeType+"'";
	qry+= " WHERE programId =" +req.body.programId+"";

	con.query(qry,function(err,result){
		if (err) throw err;
		if (result.affectedRows > 0){
			req.session.message = "Program Successfully Edited";
			res.redirect('back');
		} 
	});
});
router.get('/admin/program/delete/:program_id', isLoggedIn, isAdmin, function(req,res){
	con.query("DELETE FROM programs WHERE programId = '" + req.params.program_id +"'", function (req,result){
		if (result.affectedRows > 0){
			req.session.message = "Program Deleted";
			res.redirect('back');
		}
	});
});

function isLoggedIn(req, res, next){
	if(req.session.username){
		next();
	} else {
		req.session.message = "You must be logged in to do that!";
		res.redirect('back');
	}
}
function isAdmin(req, res, next){
	if(req.session.username == 'admin'){
		next();
	} else {
		req.session.message = "You must be admin to do that!";
		res.redirect('back');
	}
}

module.exports = router;