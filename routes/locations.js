var express = require('express');
var router = express.Router();
const db = require("../db");

db.initialize("IEdb", "Locations", function(dbCollection) { 
    // get all items
    dbCollection.findOne({id : 'X'}, (err, result) => {
        if (err) throw err;
        console.log(result);
    });

    // << db CRUD routes >>

}, function(err) { // failureCallback
    throw (err);
});

router.post("/addLocation", function(req, res) {
    const data = req.body;
});


router.get("/getLocations", function(req, res, next) {
    
});

module.exports = router;
