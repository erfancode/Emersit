const MongoClient = require("mongodb").MongoClient;

const dbConnectionUrl = "mongodb+srv://erfancode:0ahwyCZjbUFjq5BF@internetengineering-zend1.mongodb.net/test?retryWrites=true&w=majority";

var DB;

MongoClient.connect(dbConnectionUrl, function(err, dbInstance) {
    if (err) {
        console.log(`[MongoDB connection] ERROR: ${err}`);
    } else {
        DB = dbInstance.db('IEdb');
        console.log("[MongoDB connection] SUCCESS");
    }
});

function initialize(
    dbName,
    dbCollectionName,
    successCallback,
    failureCallback
) {
    MongoClient.connect(dbConnectionUrl, function(err, dbInstance) {
        if (err) {
            console.log(`[MongoDB connection] ERROR: ${err}`);
            failureCallback(err); // this should be "caught" by the calling function
        } else {
            const dbObject = dbInstance.db(dbName);
            const dbCollection = dbObject.collection(dbCollectionName);
            console.log("[MongoDB connection] SUCCESS");

            successCallback(dbCollection);
        }
    });
}

function getCollection(dbCollectionName, successCallback){
    if(DB != null){
        successCallback(DB.collection(dbCollectionName))
    }
    else
        console.log("DB is null");

}

module.exports = {
    initialize,
    getCollection
};