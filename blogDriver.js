var ObjectID = require('mongodb').ObjectID;

BlogDriver = function(db) {
	this.db = db;
};

//Alows getting of a collection
BlogDriver.prototype.getCollection = function(collectionName, callback) {
	this.db.collection(collectionName, function(error, the_collection) {
		if (error) callback(error);
		else callback(null, the_collection);
	});
};

/*
 * Gets the latest 7 articles in the DB
 */
BlogDriver.prototype.latest = function(collectionName, callback) {
	this.getCollection(collectionName, function(error, the_collection) {
		if (error) callback(error);
		else {

			var options = {
				"sort": ['publicationDate', 'asc'],
				"limit": 7
			}

			//Finding data in the DB
			the_collection.find(filters, options, function(error, doc) {
				if (error) callback(error);
				else callback(null, doc);
			});
		}
	});
};

/*
 * Gets the articles matching a page number
 * This means getting the 5 articles after the first n*5 ones
 */
BlogDriver.prototype.page = function(collectionName, pageNumber, callback) {
	this.getCollection(collectionName, function(error, the_collection) {
		if (error) callback(error);
		else {

			var options = {
				"sort": ['publicationDate', 'asc'],
				"limit": 5,
				"skip": pageNumber
			}

			//Finding data in the DB
			the_collection.find(filters, options, function(error, doc) {
				if (error) callback(error);
				else callback(null, doc);
			});
		}
	});
};

/*
 * Gets the total number of articles
 */
BlogDriver.prototype.articleAmount = function(collectionName, callback) {
	this.getCollection(collectionName, function(error, the_collection) {
		if (error) callback(error);
		else {
			//Counting data in the DB
			the_collection.count(function(error, doc) {
				if (error) callback(error);
				else {
					callback(null, doc);
				}
			});
		}
	});
};

/*
 * Gets the article's detail for a specific article url
 */
BlogDriver.prototype.article = function(collectionName, url, callback) {
	this.getCollection(collectionName, function(error, the_collection) {
		if (error) callback(error);
		else {
			//Finding data in the DB
			the_collection.findOne({"url": url}, function(error, doc) {
				if (error) callback(error);
				else callback(null, doc);
			});
		}
	});
};

//Finds objects according to a criteria in the DB
BlogDriver.prototype.get = function(collectionName, filters, callback) {
	
	//Getting only display: true articles
	filters.display = true;
	
	//Sorting according to the date
	var options = {};
	options.sort = ['publicationDate','desc'];
	
	this.getCollection(collectionName, function(error, the_collection) {
		if (error) callback(error);
		else {
			//Finding data in the DB
			the_collection.find(filters, function(error, doc) {
				if (error) callback(error);
				else callback(null, doc);
			});
		}
	});
};

exports.BlogDriver = BlogDriver;
