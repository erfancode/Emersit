var express = require('express');
var router = express.Router();
const db = require("../db");

db.initialize("IEdb", "Forms", function(dbCollection) { 
    // get all items
    dbCollection.findOne({id : '1234'}, (err, result) => {
        if (err) throw err;
        console.log(result);
    });

    // << db CRUD routes >>

}, function(err) { // failureCallback
    throw (err);
});

module.exports = router;
