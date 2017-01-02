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

/*
 * Getting a list of the 7 latest articles for the "latest" column of the blog
 * 
 * GET /latest
 */
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

/*
 * Getting a list of the 5 articles matching a page number
 * 
 * GET /page?number={id}
 */
app.get('/page', function (req, res) {

	var params = req.query;
	params["__proto__"] = null;
	console.log(new Date().toJSON() + ' - [INFO] GET request on /page with parameters ' + JSON.stringify(params));

	if (params.["number"] !== false && typeof params["number"] === "number") {
		//Fetching data
		blogDriver.page("articles", params["number"], function(error, objs) {
			if (error) { res.send(400, error); }
			else { 
				objs.toArray(function (err, articles) {
					res.send(200, articles);
				});
			}
		});
	}
});

/*
 * Getting the amount of pages available
 * 
 * GET /pageCount
 */
app.get('/pageCount', function (req, res) {
	console.log(new Date().toJSON() + ' - [INFO] GET request on /pageCount');

	//Fetching data
	blogDriver.articleAmount("articles", function(error, objs) {
		if (error) { res.send(400, error); }
		else { 
			objs.toArray(function (err, amount) {
				res.send(200, amount / 5);
			});
		}
	});
});

/*
 * Getting the full content of a specific article
 * The "url" data is the one coming from the article preview
 * 
 * GET /article?url={url}
 */
app.get('/article', function (req, res) {

	var params = req.query;
	params["__proto__"] = null;
	console.log(new Date().toJSON() + ' - [INFO] GET request on /page with parameters ' + JSON.stringify(params));

	if (params["url"] !== false && typeof params["url"] === "string") {
		//Fetching data
		blogDriver.article("articles", params["url"], function(error, objs) {
			if (error) { res.send(400, error); }
			else { 
				objs.toArray(function (err, article) {
					res.send(200, article);
				});
			}
		});
	}
});



//Creating the web server
http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
