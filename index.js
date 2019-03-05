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
					con.query(sql, function(err, results){
						if(err){
							req.session.message = 'Database could not be reached: ' + err;
							res.redirect('/');
						} else if(results.length > 0){
							results.forEach(function(el, index) {
								reviews.push(el);
								res.render("reviews", {reviews: reviews});
							});
						} else {
							res.locals.message = 'Be the first to leave a review!';
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

app.post("/reviews", function(req, res){
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
	res.redirect('programs');
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
