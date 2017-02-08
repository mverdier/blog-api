var ObjectID = require('mongodb').ObjectID;
var crypto = require('crypto');

IpDriver = function(db) {
	this.db = db;
};

//Alows getting of a collection
IpDriver.prototype.getCollection = function(collectionName, callback) {
	this.db.collection(collectionName, function(error, the_collection) {
		if (error) callback(error);
		else callback(null, the_collection);
	});
};

//Increases the request amount for an IP address
IpDriver.prototype.increment = function(collectionName, address, endpoint, param, callback) {
	this.getCollection(collectionName, function(error, the_collection) {
		if (error) callback(error);
		else {
			this.getCollection("password", function(error, passwordCollection) {
				if (error) callback(error);
				else {
					var secret = "";
					
					//Getting the hash secret from the DB
					passwordCollection.find({"name": "ip"}, function(error, doc) {
						if (error) callback(error);
						else {
							doc.toArray(function (err, pw) {
								if (pw.length !== 0 && pw[0]['secret'] !== undefined) {
									secret = pw[0]['secret'];
								}
							});	
						}
					})
					
					var count = {};

					count['count'] = 1;
					count['ip'] = crypto.createHmac('sha256', secret).update(address).digest('hex');
					count['latest'] = new Date();
					count['endpoint'] = endpoint;
					count['param'] = param;

					//Finding data for this IP address
					the_collection.find({"ip": address, "endpoint": endpoint, "param": param}, function(error, doc) {
						if (error) callback(error);
						else {

							doc.toArray(function (err, ipCount) {

								//If we already have a count for this IP address
								if (ipCount.length !== 0 && ipCount[0]['count'] !== undefined) {
									count['count'] = ipCount[0]['count'] + 1; //Updating our new value to the old one + 1
									count['_id'] = ipCount[0]['_id']; //Matching the _id field for an update
								}

								//Saving the new or updated data
								the_collection.save(count, {w:1}, function(error, doc) {
									if (error) callback(error);
								});
							});
						}
					});
				}
			}
		}
	});
};

exports.IpDriver = IpDriver;
