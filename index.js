// Course Ninja Main JS File!!!

var express = require("express");
var app = express();

var bodyParser = require("body-parser"),
	session  = require('express-session');
	
var accountRoutes = require("./routes/account");
var searchRoutes = require("./routes/search");
var adminRoutes = require("./routes/admin");
var reviewRoutes = require("./routes/reviews");

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

app.get("/flag/review/:id", function(req, res){
	var sql = "SELECT * FROM reviews WHERE reviewId = '" + req.params.id + "';";
	con.query(sql, function(err, results){
		if(err){
			req.session.message = 'Database could not be reached: ' + err;
			res.redirect('/');
		} else if(!results.length){
			res.redirect('/');
		} else {
			res.render("flag", { type: "review", review: results[0] });
		}
	});
});
app.post("/flag/review/:id", function(req, res){
	var sql = "SELECT * FROM reviews WHERE reviewId = '" + req.params.id + "';";
	con.query(sql, function(err, results){
		if(err){
			req.session.message = 'Database could not be reached: ' + err;
			res.redirect('/');
		} else {
			var review = results[0];
			var sql = "INSERT INTO flags (objectType, objectReference, objectBody, reason, isComplete) VALUES ('review', '" + req.params.id + "', '" + review.reviewBody + "', '" + req.body.flag + "', 0);";
			con.query(sql, function(err, results){
				if(err){
					req.session.message = 'Database could not be reached: ' + err;
					res.redirect('/');
				} else {
					req.session.message = 'Your message has been sent.';
					res.redirect('/');
				}
			});
		}
	});
});

app.use(reviewRoutes);
app.use(accountRoutes);
app.use(searchRoutes);
app.use(adminRoutes);


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
