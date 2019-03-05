var mysql = require('mysql');

var db = null;
module.exports = function () {
    if(!db) {
        db = mysql.createConnection({
            host: "localhost",
		    user: "ninjamaster",
		    password: "Ninya123!",
		    database: "courseninja"
        });
    }
    return db;
};

