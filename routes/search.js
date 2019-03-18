var express = require("express");
var router = express.Router();


var db = require('../dbConnection');
var con = db();

router.get("/search", function(req, res){
	res.render("search");
});

router.get("/search/autocomplete", function(req, res){
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

router.get("/search/searching", function(req, res){
	
	if(req.query.offset == 0){
		req.session.offset = 0;
	} else if(req.query.offset == 1){
		req.session.offset += 10;
	}
	
	var end = " limit 10 offset " + req.session.offset + ";"
	
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
		
		sql += end;
		con.query(sql, function(err, results){
			if(err){
				req.session.message = 'Database could not be reached: ' + err;
				res.redirect('/');
			} else {
				results.forEach(function(program) {
					data.push({
						name: program.programName,
						code: program.programCode,
						school: program.schoolName
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
		
		if(req.query.search == "school"){
			sql += end;
		} else if(req.query.search == "program"){
			sql += ";";
		}
		
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
					// program based on location
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
						// append if based on location and keywords
						sql += " AND";
						for(var i = 0; i < wordArray.length; i++){
							if(i == 0){
								sql += " LOWER(programName) LIKE '%" + wordArray[i] + "%'";
							} else {
								sql += " OR LOWER(programName) LIKE '%" + wordArray[i] + "%'";
							}
						}
					} 
					sql += end;
					
					con.query(sql, function(err, results){
						if(err){
							req.session.message = 'Database could not be reached: ' + err;
							res.redirect('/');
						} else {
							results.forEach(function(program) {
								data.push({
									name: program.programName,
									code: program.programCode,
									school: program.schoolName,
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


module.exports = router;