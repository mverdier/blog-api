//Using HTTP and Express libraries
var http = require('http'),
	express = require('express'),
	path = require('path');

var MongoClient = require('mongodb').MongoClient,
Server = require('mongodb').Server,
BlogDriver = require('./blogDriver').BlogDriver;

var app = express();
app.set('port', process.env.PORT || 3000);

var url = 'mongodb://localhost:27017/blog';
var mongoHost = 'localhost';
var mongoPort = 27017; 
var blogDriver;

//Starting the collection driver linked to our mongo database
MongoClient.connect(url, function(err, db) {
	if (!MongoClient) {
		console.error("Error! Exiting... Must start MongoDB first");
		process.exit(1);
	}

	//Fetching the blog database and both collection drivers
	blogDriver = new BlogDriver(db);
});

app.use(express.static(path.join(__dirname, 'public')));

//Getting a list of blogs according to the required filters
app.get('/latest', function (req, res) {
	console.log(new Date().toJSON() + ' - [INFO] GET request on /latest');

	//Fetching data
	blogDriver.latest("articles", function(error, objs) {
		if (error) { res.send(400, error); }
		else { 
			objs.toArray(function (err, articles) {
				res.send(200, articles);
			});
		}
	});
});

//Creating the web server
http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
