DROP DATABASE IF EXISTS courseninja;
CREATE DATABASE courseninja;

DROP USER IF EXISTS 'ninjamaster'@'localhost';
CREATE USER 'ninjamaster'@'localhost' IDENTIFIED BY 'Ninya123!';
GRANT ALL PRIVILEGES ON courseninja.* to 'ninjamaster'@'localhost';

ALTER USER 'ninjamaster'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Ninya123!';

USE courseninja;

CREATE TABLE schools (
	schoolId INT AUTO_INCREMENT PRIMARY KEY,
	schoolName VARCHAR(255),
	schoolCity VARCHAR(255),
	schoolRegion VARCHAR(255),
	schoolCountry VARCHAR (255)
);

CREATE TABLE programs (
	programId INT AUTO_INCREMENT PRIMARY KEY,
	programCode VARCHAR(255),
	programName VARCHAR(255),
	schoolId INT(8),
	schoolName VARCHAR(255),
	programLength VARCHAR(255),
	tuitionDomestic DECIMAL(6, 2),
	tuitionInternational DECIMAL(6, 2),
	isCoOp TINYINT(1),
	overallRating DECIMAL (2, 1),
	degreeType VARCHAR(255),
	
	FOREIGN KEY (schoolId)
	REFERENCES schools(schoolId)
	ON DELETE CASCADE
);

CREATE TABLE users (
	userId INT AUTO_INCREMENT PRIMARY KEY, 
	username VARCHAR(255), 
	userPassword VARCHAR(255), 
	email VARCHAR(255), 
	programId INT(8), 
	graduationStatus VARCHAR(255),
	
	FOREIGN KEY (programId)
	REFERENCES programs(programId)
	ON DELETE CASCADE
);

CREATE TABLE posts (
	postId INT AUTO_INCREMENT PRIMARY KEY,
	userId INT(8),
	dateAdded DATE,
	postBody VARCHAR(255),
	isFlagged TINYINT(1),
	isReply TINYINT(1),
	upvotes INT(8),
	downvotes INT(8),
	
	FOREIGN KEY (userId)
	REFERENCES users(userId)
	ON DELETE CASCADE
);

CREATE TABLE resources (
	resourceId INT AUTO_INCREMENT PRIMARY KEY,
	userId INT(8),
	name VARCHAR(255),
	programId INT(8),
	classCode VARCHAR(255),
	yearNum DATE,
	
	FOREIGN KEY (userId)
	REFERENCES users(userId)
	ON DELETE CASCADE,
	
	FOREIGN KEY (programId)
	REFERENCES programs(programId)
	ON DELETE CASCADE
);

CREATE TABLE vote (
	voteId INT AUTO_INCREMENT PRIMARY KEY,
	postId INT(8),
	userId INT(8),
	voteValue TINYINT(1),
	
	FOREIGN KEY (postId)
	REFERENCES posts(postId)
	ON DELETE CASCADE,
	
	FOREIGN KEY (userId)
	REFERENCES users(userId)
	ON DELETE CASCADE
);

CREATE TABLE reviews (
	reviewId INT AUTO_INCREMENT PRIMARY KEY,
	userId INT(8),
	programId INT(8),
	reviewBody VARCHAR(255),
	rating TINYINT(1),
	
	FOREIGN KEY (userId)
	REFERENCES users(userId),
	FOREIGN KEY (programId)
	REFERENCES programs(programId)
	ON DELETE CASCADE
);


