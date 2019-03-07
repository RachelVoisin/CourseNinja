// Course Ninja Main JS File!!!

var express = require("express");
var app = express();

var bodyParser = require("body-parser"),
	session  = require('express-session');
	
var accountRoutes = require("./routes/account");

const PORT = process.env.PORT || 3000

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(session({
	secret: 'wouldrathernot',
	resave: true,
	saveUninitialized: true
 } ));

var db = require('./dbConnection');
var con = db();

//middleware used on every route call
app.use(function(req, res, next){
	res.locals.user = req.session.username;
	res.locals.message = req.session.message;
	delete req.session.message;
	next();
});

app.get("/", function(req, res){
	res.render("index");
});

app.get("/autocomplete", function(req, res){
	var data = [];
	if(req.query.search == "school"){
		var sql = "SELECT schoolName FROM schools;"
		con.query(sql, function(err, results){
			if(err){
				res.send('Database could not be reached: ' + err);
			} else {
				results.forEach(function(school) {
					data.push(school.schoolName);	
				});
				res.send(data);
			}
		});
	}
	if(req.query.search == "program"){
		var school = req.query.school;
		var sql = "SELECT schoolId FROM schools WHERE schoolName = '" + school + "';";
		con.query(sql, function(err, results){
			if(err){
				req.session.message = 'Database could not be reached: ' + err;
				res.redirect('/');
			} else if(results.length){
				var sql = "SELECT programName FROM programs WHERE schoolId = '" + results[0].schoolId + "';";
				con.query(sql, function(err, results){
					results.forEach(function(program) {
						data.push(program.programName);	
					});
					res.send(data);
				});
			} else {
				res.send(data);
			}
		});
	}
});

app.get("/search", function(req, res){
	res.render("search");
});

app.get("/search/autocomplete", function(req, res){
	var data = [];
	var sql = "";
	var param = "";
	if(req.query.search == "countries"){
		sql = "SELECT DISTINCT schoolCountry FROM schools;";
		param = "schoolCountry";
	} else if(req.query.search == "regions"){
		var country = req.query.country;
		sql = "SELECT DISTINCT schoolRegion FROM schools WHERE schoolCountry = '" + country + "';";
		param = "schoolRegion";
	} else if(req.query.search == "cities"){
		var region = req.query.region;
		sql = "SELECT DISTINCT schoolCity FROM schools WHERE schoolRegion = '" + region + "';";
		param = "schoolCity";
	}
	
	con.query(sql, function(err, results){
		if(err){
			req.session.message = 'Database could not be reached: ' + err;
			res.redirect('/');
		} else {
			results.forEach(function(item) {
				data.push(item[param]);	
			});
			res.send(data);
		}
	});
});

app.get("/search/searching", function(req, res){
	var data = [];
	var loc = "";
	var wordArray = "";
		
	if(req.query.city != "--") {
		loc = " schoolCity = '" + req.query.city + "'";
	} else if(req.query.region != "--"){
		loc = " schoolRegion = '" + req.query.region + "'";
	} else if(req.query.country != "Country --"){
		loc = " schoolCountry = '" + req.query.country + "'";
	}
	// not perfect, may be cities with the same name
	
	if(req.query.keywords){
		var keywords = req.query.keywords;
		keywords = keywords.replace(",", "");
		keywords = keywords.toLowerCase();
		var wordArray = keywords.split(" ");
	}
	
	if(loc == "" && req.query.search == "program"){
		// program search based on keyword only
		var sql = "SELECT * FROM programs WHERE";
		
		for(var i = 0; i < wordArray.length; i++){
			if(i == 0){
				sql += " LOWER(programName) LIKE '%" + wordArray[i] + "%'";
			} else {
				sql += " OR LOWER(programName) LIKE '%" + wordArray[i] + "%'";
			}
		}
		
		sql += ";";
		con.query(sql, function(err, results){
			if(err){
				req.session.message = 'Database could not be reached: ' + err;
				res.redirect('/');
			} else {
				results.forEach(function(program) {
					data.push({
						name: program.programName,
						code: program.programCode,
						school: program.schoolId
					});
				});
				res.send(data);
			}
		});
	} else {
		var sql = "";
		if(loc == "" && req.query.search == "school"){
			// school select based on keywords only
			sql = "SELECT * FROM schools WHERE"
			for(var i = 0; i < wordArray.length; i++){
				if(i == 0){
					sql += " LOWER(schoolName) LIKE '%" + wordArray[i] + "%'";
				} else {
					sql += " OR LOWER(schoolName) LIKE '%" + wordArray[i] + "%'";
				}
			}
		} else if(loc != "" && req.query.search == "school" && req.query.keywords){
			// school select based on location and keywords
			sql = "SELECT * FROM schools WHERE" + loc + " AND";
			for(var i = 0; i < wordArray.length; i++){
				if(i == 0){
					sql += " LOWER(schoolName) LIKE '%" + wordArray[i] + "%'";
				} else {
					sql += " OR LOWER(schoolName) LIKE '%" + wordArray[i] + "%'";
				}
			}
		} else {
			// school select based on location alone 
			sql = "SELECT * FROM schools WHERE" + loc;
		}
		
		sql += ";";
		
		con.query(sql, function(err ,results){
			if(err){
				req.session.message = 'Database could not be reached: ' + err;
				res.redirect('/');
			} else {
				if(req.query.search == "school"){
					// pass back results
					results.forEach(function(school) {
						data.push({
							name: school.schoolName,
							city: school.schoolCity,
							region: school.schoolRegion
						});
					});
					res.send(data);
				} else if(req.query.search == "program"){
					// execute another qry 
					var schoolIds = [];
					results.forEach(function(school) {
						schoolIds.push(school.schoolId);
					});
					var sql = "SELECT * FROM programs WHERE";
					for(var i = 0; i < schoolIds.length; i++){
						if(i == 0){
							sql += " schoolId = '" + schoolIds[i] + "'";
						} else {
							sql += " OR schoolId = '" + schoolIds[i] + "'";
						}
					}
					if(req.query.keywords){
						sql += " AND";
						for(var i = 0; i < wordArray.length; i++){
							if(i == 0){
								sql += " LOWER(programName) LIKE '%" + wordArray[i] + "%'";
							} else {
								sql += " OR LOWER(programName) LIKE '%" + wordArray[i] + "%'";
							}
						}
					} 
					sql += ";";
					con.query(sql, function(err, results){
						if(err){
							req.session.message = 'Database could not be reached: ' + err;
							res.redirect('/');
						} else {
							results.forEach(function(program) {
								data.push({
									name: program.programName,
									code: program.programCode,
									school: program.schoolId
								});
							});
							res.send(data);
						}
					});
				}
			}
		});
	}
});

app.get("/admin", isLoggedIn, function(req, res){
	if (req.session.username == 'admin'){
		res.send("You passed the test!");
	}
});

app.get("/reviews", function(req, res){
	var school = req.query.school;
	var program = req.query.program;
	var reviews = [];
	var sql = "SELECT schoolId FROM schools WHERE schoolName = '" + school + "';";
	con.query(sql, function(err, results){
		if(err){
			req.session.message = 'Database could not be reached: ' + err;
			res.redirect('/');
		} else if(results.length){
			var schoolId = results[0].schoolId;
			var sql = "SELECT programId FROM programs WHERE schoolId = " + schoolId + " AND programName = '" + program + "';";
			con.query(sql, function(err, results){
				if(err){
					req.session.message = 'Database could not be reached: '+ err;
					res.redirect('/');
				} else if(results.length){
					var sql = "SELECT reviewBody, rating FROM reviews WHERE programId = " + results[0].programId + ";";
					var programId = results[0].programId;
					con.query(sql, function(err, results){
						if(err){
							req.session.message = 'Database could not be reached: ' + err;
							res.redirect('/');
						} else if(results.length > 0){
							results.forEach(function(el, index) {
								reviews.push(el);
							});
							res.render("reviews", {reviews: reviews});
						} else {
							res.locals.message = 'Be the first to leave a review!';
							res.render("reviews", {reviews: reviews});
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
		var sql = "SELECT schoolId FROM schools WHERE schoolName = '" + school + "';";
		con.query(sql, function(err ,results){
			if(err){
				req.session.message = 'Database could not be reached: ' + err;
				res.redirect('/');
			} else {
				var sql = "SELECT * FROM programs WHERE schoolId = '" + results[0].schoolId + "' AND";
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
		});	
	}
}

app.post("/:id/reviews", isLoggedIn, function(req, res){
	var review = req.body.newReview;
	var rating= req.body.rating;

	var sql = "INSERT INTO reviews (reviewBody, rating) VALUES ('" + review + "','" + rating + "');"
	con.query(sql, function(err, results){
		if(err){
			console.log(err);
		} else {
			console.log(sql);
		}
	});
	res.redirect('/reviews');
});

app.use(accountRoutes);


// redirect any unidentified urls or routes to home
app.all('*', function(req, res) {
	res.redirect("/");
});

function isLoggedIn(req, res, next){
	if(req.session.username){
		next();
	} else {
		req.session.message = "You must be logged in to do that!";
		res.redirect('back');
	}
}

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
