exports.DATABASE_URL = process.env.DATABASE_URL ||
	'mongodb://myuser:myuserpass@ds119223.mlab.com:19223/back-end-capstone-project' || 
	'mongodb://localhost/charity-app';
exports.PORT = process.env.PORT || 8080;