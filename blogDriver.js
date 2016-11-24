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

//Finds objects according to a criteria in the DB
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

exports.BlogDriver = BlogDriver;