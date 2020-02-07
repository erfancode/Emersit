var express = require('express');
var router = express.Router();
const db = require("../db");
const user = require("./users")

var appliedFormsCollection;

setTimeout(function() {
    readCollection();
},10000);

function readCollection(){
    db.getCollection('AppliedForms', function(dbCollection) { 
        if(dbCollection != null){
            console.log('AppliedForm collection read successfully')
            appliedFormsCollection = dbCollection
        }
    });
}

router.post("/submitForm", function(req, res) {
    const newSubmittedForm = req.body;

    if (!req.headers.token) {
        return res.status(403).json({ error: 'No credentials sent!' });
    }

    var token = req.headers.token;


    user.isValidToken(token, function(){

        //check for duplicate insert
        //todo
        var dbIn = {
            form_id: newSubmittedForm.form_id,
            username: newSubmittedForm.username,
            form_name : newSubmittedForm.form_name,
            type : newSubmittedForm.type,
            submit_date : newSubmittedForm.submit_date,
            data: newSubmittedForm.data
        };

        appliedFormsCollection.insertOne(dbIn, function(err) {
            if (err) throw err;
            console.log("1 form submitted");
            return res.status(200).json({ status : 200, description: 'Form submitted successfully' });
          });
    }, 
    function(){
        return res.status(403).json({ status : 403, description: 'access denied!' });
    })
});


router.get("/getSubmittedFormByUsername", function(req, res, next) {
    var username = req.query.username;

    if (!req.headers.token) {
        return res.status(403).json({ error: 'No credentials sent!' });
    }

    var token = req.headers.token;

    user.isValidToken(token, function(){
        appliedFormsCollection.find({username : username}).toArray(function(err, result) {
            if (err) throw err;
            return res.status(200).json({ forms : result, status : 200, description: '' });
          });
    }, 
    function(){
        return res.status(403).json({ status : 403, description: 'access denied!' });
    })

});

router.get("/getSubmittedFormByFormId", function(req, res, next) {
    var formId = req.query.formId;

    if (!req.headers.token) {
        return res.status(403).json({ error: 'No credentials sent!' });
    }

    var token = req.headers.token;

    user.isValidToken(token, function(){
        appliedFormsCollection.find({form_id : formId}).toArray(function(err, result) {
            if (err) throw err;
            return res.status(200).json({ forms : result, status : 200, description: '' });
          });
    }, 
    function(){
        return res.status(403).json({ status : 403, description: 'access denied!' });
    })
});

module.exports = router;
