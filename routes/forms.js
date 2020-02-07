var express = require('express');
var router = express.Router();
const db = require("../db");
const user = require("./users")

var formCollection;

setTimeout(function() {
    readCollection();
},10000);

function readCollection(){
    db.getCollection('Forms', function(dbCollection) { 
        if(dbCollection != null){
            console.log('Form collection read successfully')
            formCollection = dbCollection
        }
    });
}


router.post("/addForm", function(req, res) {
    const data = req.body;

    if (!req.headers.token) {
        return res.status(403).json({ error: 'No credentials sent!' });
    }

    var token = req.headers.token;

    user.isValidToken(token, function(){

        //check for duplicate insert
        //todo
        formCollection.insertOne(data, function(err) {
            if (err) throw err;
            console.log("1 form inserted");
            return res.status(200).json({ status : 200, description: 'Form inserted successfully' });
          });
    }, 
    function(){
        return res.status(403).json({ status : 403, description: 'access denied!' });
    })
});


router.get("/getForms", function(req, res, next) {
    
    if (!req.headers.token) {
        return res.status(403).json({ error: 'No credentials sent!' });
    }

    var token = req.headers.token;

    user.isValidToken(token, function(){
        formCollection.find({}).toArray(function(err, result) {
            if (err) throw err;
            return res.status(200).json({ forms : result, status : 200, description: '' });
          });
    }, 
    function(){
        return res.status(403).json({ status : 403, description: 'access denied!' });
    })
});

module.exports = router;
