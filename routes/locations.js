var express = require('express');
var router = express.Router();
const db = require("../db");
const user = require("./users")

var locationCollection;

setTimeout(function() {
    readCollection();
},5000);

function readCollection(){
    db.getCollection('Locations', function(dbCollection) { 
        if(dbCollection != null){
            console.log('Location collection read successfully')
            locationCollection = dbCollection
        }
    });
}

router.post("/addLocation", function(req, res) {
    const data = req.body;

    if (!req.headers.token) {
        return res.status(403).json({ error: 'No credentials sent!' });
    }

    var token = req.headers.token;

    user.isValidToken(token, function(){

        //check for duplicate insert
        //todo
        locationCollection.insertOne(data, function(err) {
            if (err) throw err;
            console.log("1 location inserted");
            return res.status(200).json({ status : 200, description: 'Location inserted successfully' });
          });
    }, 
    function(){
        return res.status(403).json({ status : 403, description: 'access denied!' });
    })
});


router.get("/getLocations", function(req, res, next) {
    if (!req.headers.token) {
        return res.status(403).json({ error: 'No credentials sent!' });
    }

    var token = req.headers.token;

    user.isValidToken(token, function(){
        locationCollection.find({}).toArray(function(err, result) {
            if (err) throw err;
            return res.status(200).json({ locations : result, status : 200, description: '' });
          });
    }, 
    function(){
        return res.status(403).json({ status : 403, description: 'access denied!' });
    })
});

module.exports = router;
