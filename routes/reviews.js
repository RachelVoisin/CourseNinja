var express = require("express");
var router = express.Router();

var db = require('../dbConnection');
var con = db();

// add lines for passing files?

router.get("/reviews", function(req, res){
	var school = req.query.school;
	var program = req.query.program;
	var reviews = [];
	var sql = "SELECT * FROM schools WHERE schoolName = '" + school + "';";
	con.query(sql, function(err, results){
		if(err){
			req.session.message = 'Database could not be reached: ' + err;
			res.redirect('/');
		} else if(results.length > 0){
			school = results[0];
			var sql = "SELECT * FROM programs WHERE schoolId = " + school.schoolId + " AND programName = '" + program + "';";
			con.query(sql, function(err, results){
				if(err){
					req.session.message = 'Database could not be reached: '+ err;
					res.redirect('/');
				} else if(results.length > 0){
					program = results[0];
					var sql = "SELECT * FROM reviews WHERE programId = " + program.programId + ";";
					con.query(sql, function(err, results){
						if(err){
							req.session.message = 'Database could not be reached: ' + err;
							res.redirect('/');
						} else if(results.length > 0){
							results.forEach(function(el, index) {
								reviews.push(el);
							});
							res.render("reviews", {reviews: reviews, program: program, school: school});
						} else {
							res.locals.message = 'Be the first to leave a review!';
							res.render("reviews", {reviews: reviews, program: program, school: school});
						}
					});
				} else {
					searchError(req, res, "program", school, program);
				}
			});
		} else {
			searchError(req, res, "school", school, program);
		}
	});
});

function searchError(req, res, err, school, program){
	var data = [];
	var excludes = ["college", "university", "of", "the", "and"];
	if(err == "school"){
		var sql = "SELECT * FROM schools WHERE";
		var wordArray = school.split(" ");
		
		wordArray.forEach(function(keyword){
			keyword = keyword.toLowerCase();
			if(excludes.indexOf(keyword) != -1 | keyword.length < 2){
				var index = wordArray.indexOf(keyword);
				wordArray.splice(index, 1);
			}
		});
		
		for(var i = 0; i < wordArray.length; i++){
			if(i == 0){
				sql += " LOWER(schoolName) LIKE '%" + wordArray[i] + "%'";
			} else {
				sql += " OR LOWER(schoolName) LIKE '%" + wordArray[i] + "%'";
			}
		}
		sql += ";";	
		
		con.query(sql, function(err ,results){
			if(err){
				req.session.message = 'Database could not be reached: ' + err;
				res.redirect('/');
			} else {
				results.forEach(function(school) {
					data.push({
						name: school.schoolName,
						city: school.schoolCity,
						region: school.schoolRegion
					});
				});
				res.render("searchError", {err: "school", data: data, school: school, program: program});
			}
		});	
	} else if(err == "program"){
		var sql = "SELECT * FROM programs WHERE schoolId = '" + school.schoolId + "' AND";
		var wordArray = program.split(" ");
		
		wordArray.forEach(function(keyword){
			keyword = keyword.toLowerCase();
			if(excludes.indexOf(keyword) != -1 | keyword.length < 2){
				var index = wordArray.indexOf(keyword);
				wordArray.splice(index, 1);
			}
		});
		
		for(var i = 0; i < wordArray.length; i++){
			if(i == 0){
				sql += " LOWER(programName) LIKE '%" + wordArray[i] + "%'";
			} else {
				sql += " OR LOWER(programName) LIKE '%" + wordArray[i] + "%'";
			}
		}
		sql += ";";	
		con.query(sql, function(err ,results){
			if(err){
				req.session.message = 'Database could not be reached: ' + err;
				res.redirect('/');
			} else {
				results.forEach(function(program) {
					data.push({
						name: program.programName,
						code: program.programCode
					});
				});
				res.render("searchError", {err: "program", data: data, school: school, program: program});
			}
		});	
	}
}

router.post("/reviews/:id", function(req, res){
	var review = req.body.newReview;
	var rating = req.body.rating;
	var programId = req.params.id;

	var sql = "INSERT INTO reviews (programId, reviewBody, rating) VALUES ('" + programId + "','" + review + "','" + rating +"');"
	con.query(sql, function(err, results){
		if(err){
			console.log(err + sql);
		} else {
			var sql = "SELECT rating FROM reviews WHERE programId = '" + programId + "';";
			console.log(sql);
			con.query(sql, function(err, results){
				if(err){
					console.log(err + sql);
				} else {
					var total = 0;
					results.forEach(function(rating){
						total += rating.rating;
					});
					var avg = total / results.length;
					avg = Math.round(avg);
					var sql = "UPDATE programs SET overallRating = " + avg + " WHERE programId = '" + programId + "';";
					con.query(sql, function(err, results){
						if(err){
							console.log(err + sql);
						} else {
							req.session.message = "program successfully rated";
							res.redirect('back');
						}
					});
					
				}
			});
		}
	});
});

module.exports = router;