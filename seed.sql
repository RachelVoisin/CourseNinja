DELETE FROM programs;
DELETE FROM schools;

INSERT INTO users (username, userPassword) VALUES ('testUser', '123');
INSERT INTO users (username, userPassword) VALUES ('admin', 'admin');

INSERT INTO schools (schoolId, schoolName, schoolCity, schoolRegion, schoolCountry) VALUES (1, "Fanshawe College", "London", "Ontario", "Canada");

INSERT INTO programs (programCode, programName, schoolId, programLength, tuitionDomestic, tuitionInternational, isCoOp, overallRating, degreeType) VALUES ("IWD1", "Internet Applications and Web Development", 1, "2 Years", 2187.02, 7777.21, 0, 0, "Ontario College Diploma");

INSERT INTO programs (programCode, programName, schoolId, programLength, tuitionDomestic, tuitionInternational, isCoOp, overallRating, degreeType) VALUES ("CPA2", "Computer Programmer Analyst", 1, "3.5 Years", 2393.31, 7983.50, 1, 0, "Ontario College Advanced Diploma");







