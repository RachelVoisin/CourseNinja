
DELETE FROM programs;
DELETE FROM schools;

INSERT INTO schools (schoolId, schoolName, schoolCity, schoolRegion, schoolCountry) VALUES (1, "Fanshawe College", "London", "Ontario", "Canada");

INSERT INTO schools (schoolName, schoolCity, schoolRegion, schoolCountry) VALUES ("Western University", "London", "Ontario", "Canada");

INSERT INTO schools (schoolName, schoolCity, schoolRegion, schoolCountry) VALUES ("Contestoga College", "Kitchener", "Ontario", "Canada");

INSERT INTO schools (schoolName, schoolCity, schoolRegion, schoolCountry) VALUES ("University of Waterloo", "Waterloo", "Ontario", "Canada");

INSERT INTO schools (schoolName, schoolCity, schoolRegion, schoolCountry) VALUES ("Wilfrid Laurier University", "Waterloo", "Ontario", "Canada");

INSERT INTO schools (schoolName, schoolCity, schoolRegion, schoolCountry) VALUES ("McGill University", "Montreal", "Quebec", "Canada");

INSERT INTO schools (schoolName, schoolCity, schoolRegion, schoolCountry) VALUES ("Montreal College of Information Technology", "Montreal", "Quebec", "Canada");

INSERT INTO schools (schoolName, schoolCity, schoolRegion, schoolCountry) VALUES ("Simon Fraser University", "Burnaby", "British Columbia", "Canada");

INSERT INTO programs (programCode, programName, schoolId, schoolName, programLength, tuitionDomestic, tuitionInternational, isCoOp, overallRating, degreeType) VALUES ("IWD1", "Internet Applications and Web Development", 1, "Fanshawe College", "2 Years", 2187.02, 7777.21, 0, 0, "Ontario College Diploma");

INSERT INTO programs (programCode, programName, schoolId, schoolName, programLength, tuitionDomestic, tuitionInternational, isCoOp, overallRating, degreeType) VALUES ("CPA2", "Computer Programmer Analyst", 1, "Fanshawe College", "3.5 Years", 2393.31, 7983.50, 1, 0, "Ontario College Advanced Diploma");

INSERT INTO programs (programCode, programName, schoolId, schoolName, programLength, tuitionDomestic, tuitionInternational, isCoOp, overallRating, degreeType) VALUES ("CTN2", "Computer Systems Technician", 1, "Fanshawe College", "3.5 Years", 2393.31, 7983.50, 1, 0, "Ontario College Advanced Diploma");


INSERT INTO programs (programCode, programName, schoolId, schoolName, programLength, tuitionDomestic, tuitionInternational, isCoOp, overallRating, degreeType) VALUES ("CTY1", "Computer Systems Technology", 1, "Fanshawe College", "3.5 Years", 2393.31, 7983.50, 1, 0, "Ontario College Advanced Diploma");


INSERT INTO programs (programCode, programName, schoolId, schoolName, programLength, tuitionDomestic, tuitionInternational, isCoOp, overallRating, degreeType) VALUES ("CYB1", "Cyber Security", 1, "Fanshawe College", "3.5 Years", 2393.31, 7983.50, 1, 0, "Ontario College Advanced Diploma");


INSERT INTO programs (programCode, programName, schoolId, schoolName, programLength, tuitionDomestic, tuitionInternational, isCoOp, overallRating, degreeType) VALUES ("GDP1", "Game Development - Advanced Programming", 1, "Fanshawe College", "3.5 Years", 2393.31, 7983.50, 1, 0, "Ontario College Graduate Diploma");


INSERT INTO programs (programCode, programName, schoolId, schoolName, programLength, tuitionDomestic, tuitionInternational, isCoOp, overallRating, degreeType) VALUES ("HSY2", "Health Systems Management", 1, "Fanshawe College", "3.5 Years", 2393.31, 7983.50, 1, 0, "Ontario College Advanced Diploma");


INSERT INTO programs (programCode, programName, schoolId, schoolName, programLength, tuitionDomestic, tuitionInternational, isCoOp, overallRating, degreeType) VALUES ("ISM1", "Information Security Management", 1, "Fanshawe College", "3.5 Years", 2393.31, 7983.50, 1, 0, "Ontario College Advanced Diploma");


INSERT INTO programs (programCode, programName, schoolId, schoolName, programLength, tuitionDomestic, tuitionInternational, isCoOp, overallRating, degreeType) VALUES ("NSA1", "Network and Security Architecture", 1, "Fanshawe College", "3.5 Years", 2393.31, 7983.50, 1, 0, "Ontario College Advanced Diploma");


INSERT INTO programs (programCode, programName, schoolId, schoolName, programLength, tuitionDomestic, tuitionInternational, isCoOp, overallRating, degreeType) VALUES ("OEA3", "Office Administration - Executive", 1, "Fanshawe College", "3.5 Years", 2393.31, 7983.50, 1, 0, "Ontario College Advanced Diploma");


INSERT INTO programs (programCode, programName, schoolId, schoolName, programLength, tuitionDomestic, tuitionInternational, isCoOp, overallRating, degreeType) VALUES ("OAG1", "Office Administration - General", 1, "Fanshawe College", "3.5 Years", 2393.31, 7983.50, 1, 0, "Ontario College Advanced Diploma");


INSERT INTO programs (programCode, programName, schoolId, schoolName, programLength, tuitionDomestic, tuitionInternational, isCoOp, overallRating, degreeType) VALUES ("OAM4", "Office Administration - Health Services", 1, "Fanshawe College", "3.5 Years", 2393.31, 7983.50, 1, 0, "Ontario College Advanced Diploma");


INSERT INTO programs (programCode, programName, schoolId, schoolName, programLength, tuitionDomestic, tuitionInternational, isCoOp, overallRating, degreeType) VALUES ("SST3", "Software and Information Systems Testing (Co-op)", 1, "Fanshawe College", "3.5 Years", 2393.31, 7983.50, 1, 0, "Ontario College Advanced Diploma");






