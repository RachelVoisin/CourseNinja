var express = require("express");
var router = express.Router();

var db = require('../dbConnection');
var con = db();

router.get("/admin", isLoggedIn, isAdmin, function(req, res){
	res.redirect("/admin/program");
});
router.get("/admin/program", isLoggedIn, isAdmin, function(req, res){
	con.query("SELECT * FROM programs ORDER BY programCode DESC", function(err,result){
		res.render('admin/show-program',{ items: result, page: "program" });
	});
});
router.get('/admin/program/add', isLoggedIn, isAdmin, function(req,res){
	res.render('admin/add-program.ejs', {page: "program"});
});
router.post('/admin/program/add', isLoggedIn, isAdmin, function(req,res){
	
	var qry = "SELECT schoolId from schools where schoolName = '" + req.body.schoolName + "';";
	
	con.query(qry,function(err,result){
		if(err){
			console.log(err);
		} else if (result.length) {
			var qry = "INSERT INTO programs(programCode,programName,schoolId,schoolName,programLength,tuitionDomestic,tuitionInternational,isCoOp, degreeType) VALUES (";
			qry+= "'" +req.body.programCode+"',";
			qry+= "'" +req.body.programName+"',";
			qry+= "'" +result[0].schoolId+"',";
			qry+= "'" +req.body.schoolName+"',";
			qry+= "'" +req.body.programLength+"',";
			qry+= "'" +req.body.tuitionDomestic+"',";
			qry+= "'" +req.body.tuitionInternational+"',";
			qry+= "'" +req.body.isCoOp+"',";
			qry+= "'" +req.body.degreeType+"');";

			con.query(qry,function(err,result){
				if(err){
					console.log(err);
				} else {
					req.session.message = "Program Successfully Added";
					res.redirect('back');
				}
			});
		} else {
			req.session.message = "School not found.";
			res.redirect('back');
		}
	});
});
router.get('/admin/program/edit/:program_id', isLoggedIn, isAdmin, function(req,res){
	con.query("SELECT * FROM programs WHERE programId = '" + req.params.program_id +"'", function (req,result){
		res.render('admin/edit-program.ejs', {items: result, page: "program"});
	});
});
router.post('/admin/program/edit/:program_id', isLoggedIn, isAdmin, function(req,res){	
	var qry = "UPDATE programs SET  ";
	qry+= "programCode='" +req.body.programCode+"',";
	qry+= "programName='" +req.body.programName+"',";
	qry+= "schoolId='" +req.body.schoolId+"',";
	qry+= "schoolName='" +req.body.schoolName+"',";
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
	con.query("DELETE FROM programs WHERE programId = '" + req.params.program_id +"'", function (err,result){
		if (err) throw err;
		if (result.affectedRows > 0){
			req.session.message = "Program Deleted";
			res.redirect('back');
		}
	});
});


//school functions
router.get('/admin/school', isLoggedIn, isAdmin, function(req,res){
	con.query("SELECT * FROM schools ORDER BY schoolId DESC", function(err,result){
		res.render('admin/show-school',{ items: result, page: "school" });
	});
});


router.get('/admin/school/add', isLoggedIn, isAdmin, function(req,res){
	res.render('admin/add-school.ejs', { page: "school" });
});
router.post('/admin/school/add', isLoggedIn, isAdmin, function(req,res){
	
	
			var qry = "INSERT INTO schools(schoolName,schoolCity,schoolRegion,schoolCountry) VALUES (";
		
			qry+= "'" +req.body.schoolName+"',";
			qry+= "'" +req.body.schoolCity+"',";
			qry+= "'" +req.body.schoolRegion+"',";	
			qry+= "'" +req.body.schoolCountry+"');";

			con.query(qry,function(err,result){
				if(err){
					console.log(err);
				} else {
					req.session.message = "School Successfully Added";
					res.redirect('back');
				}
			});
		
	
});

router.get('/admin/school/edit/:school_id', isLoggedIn, isAdmin, function(req,res){
	con.query("SELECT * FROM schools WHERE schoolId = '" + req.params.school_id +"'", function (err,result){
		res.render('admin/edit-school.ejs', {items: result, page: "school"});
	});
});

router.post('/admin/school/edit/:school_id', isLoggedIn, isAdmin, function(req,res){

	var qry = "UPDATE programs SET  ";
	qry+= "programCode='" +req.body.programCode+"',";
	qry+= "programName='" +req.body.programName+"',";
	qry+= "schoolId='" +req.body.schoolId+"',";
	qry+= "schoolName='" +req.body.schoolName+"',";
	qry+= "programLength='" +req.body.programLength+"',";
	qry+= "tuitionDomestic='" +req.body.tuitionDomestic+"',";
	qry+= "tuitionInternational='" +req.body.tuitionInternational+"',";
	qry+= "isCoOp='" +req.body.isCoOp+"',";
	qry+= "degreeType='" +req.body.degreeType+"'";
	qry+= " WHERE programId =" +req.body.programId+"";
	
	var qry = "UPDATE schools SET  ";
	qry+= "schoolName='" +req.body.schoolName+"',";
	qry+= "schoolCity='" +req.body.schoolCity+"',";
	qry+= "schoolRegion='" +req.body.schoolRegion+"',";
	qry+= "schoolCountry='" +req.body.schoolCountry+"'";
	qry+= " WHERE schoolId =" +req.body.schoolId+"";

	con.query(qry,function(err,result){
		if (err) throw err;
		if (result.affectedRows > 0){
			req.session.message = "School Successfully Edited";
			res.redirect('back');
		} 
	});
});

router.get('/admin/school/delete/:school_id', isLoggedIn, isAdmin, function(req,res){
	con.query("DELETE FROM schools WHERE schoolId = '" + req.params.school_id +"'", function (err,result){
		if (result.affectedRows > 0){
			req.session.message = "School Deleted";
			res.redirect('back');
		}
	});
});


// flag functions
router.get("/admin/flag", isLoggedIn, isAdmin, function(req, res){
	res.redirect("/admin/flag/review");
});

router.get("/admin/flag/review", isLoggedIn, isAdmin, function(req, res){
	var sql = "SELECT * FROM flags WHERE objectType = 'review' AND isComplete = 0;";
	con.query(sql, function(err, results){
		if(err){
			req.session.message = 'Database could not be reached: ' + err;
			res.redirect('/');
		} else {
			res.render("admin/flag/review", {flags: results, page: "flag"});
		}
	});
});

router.get("/admin/flag/review/delete/:flag_id/:review_id", isLoggedIn, isAdmin, function(req, res){
	con.query("DELETE FROM reviews WHERE reviewId = '" + req.params.review_id + "';", function (err, result){
		if (result.affectedRows > 0){
			con.query("UPDATE flags SET isComplete = 1 WHERE flagId = '" + req.params.flag_id + "';", function (err,result){
				if (result.affectedRows > 0){
					req.session.message = "Review deleted, flag closed";
					res.redirect('back');
				}
			});
		}
	});
});

router.get("/admin/flag/finish/:id", isLoggedIn, isAdmin, function(req, res){
	con.query("UPDATE flags SET isComplete = 1 WHERE flagId = '" + req.params.id + "';", function (err, result){
		if (result.affectedRows > 0){
			req.session.message = "Flag Closed";
			res.redirect('back');
		}
	});
});


// middleware 
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