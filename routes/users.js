var express = require('express');
var router = express.Router();
const db = require("../db");

db.initialize("IEdb", "Users", function(dbCollection) { 
    // get all items
    dbCollection.findOne({username : 'erfancode'}, (err, result) => {
        if (err) throw err;
        console.log(result);
    });

    // << db CRUD routes >>

}, function(err) { // failureCallback
    throw (err);
});



//login 
router.post("", function(req, res) {
    const data = req.body;
});

//logout
router.get("/", function(req, res, next) {
    // var returnData = {"status" : "error", "description" : "" ,"data" : null};

    // if(formsList != null){
    //     returnData.status = "success";
    //     returnData.description = "success";
    //     returnData.data = formsList;
    // }

    // res.json(returnData);
});

module.exports = router;
