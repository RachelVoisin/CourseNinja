var express = require("express");
var router = express.Router();

var bcrypt = require('bcrypt');

var db = require('../dbConnection');
var con = db();

router.post('/login', function(req, res){
    var name = req.body.username;
    var pass = req.body.password;
	
    var sql = "SELECT userId, username, userPassword FROM users WHERE username = '" + name + "'";

    con.query(sql, function(err, results){
		if(err){
			req.session.message = "Database could not be reached";
			res.redirect('/');
		} else if(results.length){
			if(bcrypt.compareSync(pass, results[0].userPassword)) {
				req.session.userId = results[0].userId;
				req.session.username = results[0].username;
				res.redirect('/');
			} else {
				req.session.message = "Incorrect password. Please try again.";
				res.redirect("/");
			} 
		} else {
			req.session.message = "Username not found. Please try again.";
			res.redirect("/");
		}
	});
});

router.post('/logout', function(req, res){
	req.session.message = "You have been logged out";
	req.session.userId = "";
	req.session.username = "";
	res.redirect('/');
});

router.get("/register", function(req, res){
	if(typeof req.session.signupName != "undefined"){
		res.locals.signupName = req.session.signupName;
		res.locals.email = req.session.email;
		res.locals.password = req.session.password;
		res.locals.password2 = req.session.password2;
		delete req.session.signupName;
		delete req.session.email;
		delete req.session.password;
		delete req.session.password2;
	}
	res.render("register");
});

router.post("/register", function(req, res){
	var email = req.body.email
	var name = req.body.username;
    var pass = req.body.password;
	var pass2 = req.body.password2;
	
	var restart = function(){
		req.session.email = email;
		req.session.signupName = name;
		req.session.password = pass;
		req.session.password2 = pass2;
		res.redirect("/register");
	}
	
	var sql="SELECT * FROM users WHERE username = '" + name + "';";
	con.query(sql, function(err, results, fields){
		if(err){
			req.session.message = "Database could not be reached";
			res.redirect('/register');
		} else if (results.length){
			req.session.message = "That username is already taken.";
			restart();
		} else {
			if(pass === pass2){
				name = name.trim();
				email = email.trim();
				pass = pass.trim();
				if(name.length == 0){
					req.session.message = "Username is required.";
					restart();
					// something to turn input red
				} else if(email.length == 0){
					req.session.message = "Email is required.";
					restart();
				} else if(pass.length == 0){
					req.session.message = "Password is required.";
					restart();
				} else {
					var regex = /\S+@\S+\.\S+/;
					if(!regex.test(email)){
						req.session.message = "Email format is invalid.";
						restart();
					} else {
						var hash = bcrypt.hashSync(pass, 10);
						var sql="INSERT INTO users (username, userPassword, email) VALUES ('" + name + "','" + hash + "','" + email + "');";
						con.query(sql, function(err, results, fields){
							if(err){
								req.session.message = "Database could not be reached";
								res.redirect('/register');
							} else {
								req.session.message = "Account has been created.";
								// log them in afterward
								req.session.userId = results.insertId;
								req.session.username = name;
								res.redirect("/");
							}
						});
					}
				}
			} else {
				req.session.message = "Passwords do not match!";
				restart();
			}
		} 
	});
});

router.get("/user/:username", isLoggedIn, function(req, res){
	if(req.session.username != req.params.username){
		req.session.message = "Unauthorized Access";
		res.redirect("/");
	} else {
		var sql = "SELECT * FROM users WHERE username = '" + req.params.username + "';";
		con.query(sql, function(err, results){
			if(err){
				req.session.message = "Database could not be reached";
				res.redirect('/');
			} else {
				var email = results[0].email;
				var gradStatus = results[0].graduationStatus;
				var sql = "SELECT * FROM programs WHERE programId = '" + results[0].programId + "';";
				con.query(sql, function(err, results){
					if(err){
						req.session.message = "Database could not be reached";
						res.redirect('/');
					} else {
						if(results.length == 0){
							res.render("user", {email: email, gradStatus: gradStatus});
						} else {
							var programName = results[0].programName;
							var sql = "SELECT * FROM schools WHERE schoolId = '" + results[0].schoolId + "';";
							con.query(sql, function(err, results){
								if(err){
									req.session.message = "Database could not be reached";
									res.redirect('/');
								} else {
									res.render("user", {email: email, gradStatus: gradStatus, programName: programName, schoolName: results[0].schoolName});
								}
							});
						}
					}
				});	
			}
		});
	}
});

function isLoggedIn(req, res, next){
	if(req.session.username){
		next();
	} else {
		req.session.message = "You must be logged in to do that!";
		res.redirect('back');
	}
}


module.exports = router;