// create express object from express module
var express = require('express');
// call express constructor to create express application object
var app = express();


var bodyParser = require('body-parser'),
session = require('express-session'),
mysql = require("mysql");

const PORT = process.env.port || 3000

//app.set("view engine", "ejs");
//app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
// might need to use a path module
//app.set('views', __dirname + 'CourseNinja/views');
app.use(express.static(__dirname + "/public"));






var config = mysql.createConnection({
    host: "localhost",
  user: "ninjamaster",
  password: "Ninya123!",
  database: "courseninja"
});

config.connect(function(err) {
  if (err) throw err;
  console.log("Connected to Database!");
});




// create a handler (using an arrow function) for the HTTP GET request
// use the __dirname global value to create fully qualified url
//app.get('/', (request, response) => response.sendFile(__dirname + "/index.html"));

app.get("/", function(req, res){res.render("courseAdmin");  });

// create a handler (using an arrow function) for the HTTP POST request
app.post('/insert', function(request, response) {
    let postBody = request.body;

    
    let programCode = postBody.programCode;
    let programName = postBody.programName;
    //let schoolId = postBody.schoolId
    let programLength = postBody.programLength;
   let tuitionDomestic = postBody.tutionDomestic;
    let tutionInternational = postBody.tutionInternational;
   let isCoOp= postBody.isCoOp;
   let overallRating = postBody.overallRating;
   let degreeType = postBody.degreeType;

    response.send(postBody);

   

    mysql.connect(config, function (err) {
        if (err) {
            console.log(err);
        }


        var request = new mysql.Request();

        let qry = "INSERT INTO programs(programCode,programName,programLength,tuitionDomestic,tutionInternational,isCoOp, overallRating, degreeType)"+ 
        "VALUES (@programCode,@programName,@programLength,@tuitionDomestic,@tutionInternational,@isCoOp, @overallRating, @degreeType)";
        qry = qry.replace("@programCode", "'" + programCode + "'");
        qry = qry.replace("@programName", "'" + programName + "'");
        //qry = qry.replace("@schoolId", "'" + schoolId + "'");
        qry = qry.replace("@programLength", "'" + programLength + "'");
        qry = qry.replace("@tuitionDomestic", "'" + tuitionDomestic + "'");
        qry = qry.replace("@tutionInternational", "'" + tutionInternational + "'");
        qry = qry.replace("@isCoOp", "'" + isCoOp + "'");
        qry = qry.replace("@overallRating", "'" + overallRating + "'");
        qry = qry.replace("@degreeType", "'" + degreeType + "'");
        request.query(qry, function (err, recordset) {
            if (err) {
                console.log(err);
            }

            response.send(recordset);
            console.log(recordset);
        });
    });
});

app.post('/find', (request, response) => {

    let postBody = request.body;
    findData(postBody.programId, response);

});
//updating data requests
app.post('/update', (request, response) => {

    let postBody = request.body;
    updateData(postBody.programId, postBody.programCode, postBody.programName,  postBody.programLength, postBody.tuitionDomestic, postBody.tutionInternational, postBody.isCoOp, postBody.overallRating, postBody.degreeType, response);

});
// deleting data requests
app.post('/delete', (request, response) => {

    let postBody = request.body;
    deleteData(postBody.programId, response);

});

let findData = function (programId, response) {
    // connecting to the store database I created 
    mysql.connect(config, function (err) {

        

        // create Request object
        var request = new mysql.Request();

        let qry = "SELECT * FROM programs WHERE programId =" + programId;
        request.query(qry, function (err, recordset) {

            if (err) {
                console.log(err);
            }
            console.log(recordset);


            response.send(recordset);
            mysql.close();
        });
    });
};

let updateData = function (programId, programCode, programName,  programLength, tuitionDomestic, tutionInternational , isCoOp, overallRating, degreeType, response) {
    // connect to the store database I made 
    mysql.connect(config, function (err) {

        if (err) {
            console.log(err);
        }

        // creating request object
        var request = new mysql.Request();

        let qry = "Update programs SET programCode = '" + programCode + "' ,programName =  '" + programName +  "' ,programLength =  '" + programLength + "' ,tuitionDomestic =  '" + tuitionDomestic + "' ,tutionInternational =  '" + tutionInternational 
        + "' ,isCoOp =  '" + isCoOp + "' ,overallRating =  '" + overallRating + "' ,degreeType =  '" + degreeType +"' WHERE programId = " + programId;
        request.query(qry, function (err, recordset) {

          



            response.send(recordset);
            mysql.close();
        });
    });
};

let deleteData = function (programId, response) {
    // connecting to the store database I created 
    mysql.connect(config, function (err) {

       

        // create Request object
        var request = new mysql.Request();

        let qry = "DELETE FROM programs WHERE programId =" + programId;
        request.query(qry, function (err, recordset) {

            if (err) {
                console.log(err);
            }


            // debugging some things here 
            response.send(recordset);
            mysql.close();
        });
    });
};


//  create a server listening on port 3000
app.listen(3000, () => console.info('Application running on port 3000'));