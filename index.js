// Course Ninja Main JS File!!!

var express = require("express");
var app = express();

var bodyParser = require("body-parser");

const PORT = process.env.PORT || 3000

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
	res.render("index");
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));