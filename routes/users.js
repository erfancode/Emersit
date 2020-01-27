var express = require('express');
var router = express.Router();
const db = require("../db");

var UserCollection;
var tokens = [];

setTimeout(function() {
    readCollection();
},5000);

function readCollection(){
    db.getCollection('Users', function(dbCollection) { 
        if(dbCollection != null){
            console.log('User collection read successfully')
            UserCollection = dbCollection
        }
    });
}


//login 
router.post("/login", function(req, res) {
    const data = req.body;

    const reqPassword = data.password
    const reqUsername = data.username

    console.log(reqPassword + ' ' + reqUsername)

    if(UserCollection != null){
        UserCollection.findOne({username : reqUsername, password : reqPassword}, (err, result) => {
            if (err) 
                throw err;
            //read password and check it
            //return user not found or build a a token and retrun user imformation
            if(result != null){
                var token = reqUsername + reqPassword;
                tokens.push(token)
                result.token = token
                return res.json({ user: result, status : 200, description : 'Login successfully' })
            }
            else{
                return res.json({ user: result, status : 200, description : 'Invalid username or password' })
            }
            
        })
    }
    else{
        readCollection()
        return res.status(500).json({error : 'connection with DB interupted'})
    }

});

//logout
router.get("/logout", function(req, res, next) {
    
    if (!req.headers.token) {
        return res.status(403).json({ error: 'No credentials sent!' });
    }

    var token = req.headers.token;

    if(UserCollection != null){
        var index = tokens.indexOf(token)

        if(index > -1){
            tokens.pop(token)
        }
        return res.status(200).json({ status : 200, description: 'Logout successfully' });
    }
    else{
        readCollection()
        return res.status(500).json({error : 'connection with DB interupted'})
    }
});

function isValidToken(token, validFunction, invalidFunction){
    const index = tokens.indexOf(token)
    if(index > -1){
        validFunction()
    }
    else{
        invalidFunction()
    }
}

module.exports = {
    router,
    isValidToken
}
