// Course Ninja Main JS File!!!

var express = require("express");
var app = express();

var bodyParser = require("body-parser"),
	session  = require('express-session'),
	mysql = require('mysql');

const PORT = process.env.PORT || 3000

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public")); 
app.use(session({
	secret: 'wouldrathernot',
	resave: true,
	saveUninitialized: true
 } ));

var con = mysql.createConnection({
  host: "localhost",
  user: "ninjamaster",
  password: "Ninya123!",
  database: "courseninja"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to Database!");
});

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

app.post('/login', function(req, res){
    var name = req.body.username;
    var pass = req.body.password;
    var sql = "SELECT userId, username FROM users WHERE username = '" + name + "' and userPassword = '" + pass + "'";  
	
    con.query(sql, function(err, results){
		if(err){
			req.session.message = "Database could not be reached";
			res.redirect('/');
		} else if(results.length){
            req.session.userId = results[0].userId;
            req.session.username = results[0].username;
            res.redirect('/');
		} else {
			sql = "SELECT username FROM users WHERE username = '" + name + "';";
			con.query(sql, function(err, results){ 
				if(results.length){
					req.session.message = "Incorrect password. Please try again."
					res.redirect("/");
				} else {
					req.session.message = "Username not found. Please try again."
					res.redirect("/");
				}
			});			
		}
	});
});

app.post('/logout', function(req, res){
	req.session.message = "You have been logged out";
	req.session.userId = "";
	req.session.username = "";
	res.redirect('/');
});

app.get("/register", function(req, res){
	res.render("register");
});

app.get("/login", function(req, res){
	res.redirect("/");
});

app.post("/register", function(req, res){
	var email = req.body.email
	var name = req.body.username;
    var pass = req.body.password;
	var pass2 = req.body.password2;
	// validate and/or escape values
	// do something to ensure usernames are unique
	if(pass === pass2){
		var sql="INSERT INTO users (username, userPassword) VALUES ('" + name + "','" + pass + "');";  
		con.query(sql, function(err, results){      
			if(err){
				req.session.message = "Database could not be reached";
				res.redirect('/register');
			} else {
				req.session.message = "Account has been created.";
				res.redirect("/");
			}
		});
	} else {
		req.session.message = "Passwords do not match!";
		res.redirect("/register");
	}
});

app.get("/admin", isLoggedIn, function(req, res){
	res.send("You passed the test!");
});

app.get("/programs", function(req, res){
	// temporary for displaying review page because there is nothing in the database
	var reviews =[];
	var sql = "SELECT reviewBody, rating FROM reviews;";
	con.query(sql, function(err, results){
		if(err){
			req.session.message = 'Error getting reviews';
		} else {
			results.forEach(function(el, index) {
				reviews.push(el);
			});
		}
		res.render("reviews" ,{reviews: reviews});
	});
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
			var sql = "SELECT programId FROM programs WHERE schoolId = " + schoolId + "AND programName = '" + program + "';";
			con.query(sql, function(err, results){
				if(err){
					req.session.message = 'Database could not be reached: '+ err;
					res.redirect('/');
				} else if(results.length){
					var sql = "SELECT reviewBody, rating FROM reviews WHERE programId = " + results[0].programId + ";";
					con.query(sql, function(err, results){
						if(err){
							req.session.message = 'Database could not be reached: ' + err;
							res.redirect('/');
						} else if(results.length){
							results.forEach(function(el, index) {
								reviews.push(el);
								res.render("reviews", {reviews: reviews});
							});
						} else {
							req.session.message = 'Be the first to leave a review!';
							res.render("reviews", {reviews: reviews});
						}
					});
				} else {
					req.session.message = 'Could not find program with that name';
					// redirect to program list?
					res.redirect('/');
				}
			});
		} else {
			req.session.message = 'Could not find school with that name';
			// redirect to school list?
			res.redirect('/');
		}
	});
});


// add route for redirecting anything else 

function isLoggedIn(req, res, next){
	if(req.session.username){
		next();
	} else {
		res.send("You must be logged in to do that!");
	}
}

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));