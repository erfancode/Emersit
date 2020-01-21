var express = require('express');
var router = express.Router();
const db = require("../db");

db.initialize("IEdb", "AppliedForms", function(dbCollection) { 
    // get all items
    dbCollection.findOne({id : 'X'}, (err, result) => {
        if (err) throw err;
        console.log(result);
    });

    // << db CRUD routes >>

}, function(err) { // failureCallback
    throw (err);
});

router.post("/submitForm", function(req, res) {
    const data = req.body;
});


router.get("/getSubmittedFormByUsername/:username", function(req, res, next) {
    
});

router.get("/getSubmittedFormByFormId/:formId", function(req, res, next) {
    
});

module.exports = router;
