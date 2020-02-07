var express = require('express');
var router = express.Router();
const db = require("../db");

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

var UserCollection;

setTimeout(function() {
    readCollection();
},10000);

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
        UserCollection.findOne({username : reqUsername}, (err, user) => {
            if (err) 
                return res.json({ user: null, status : 500, description : 'Error on the server' })
            //read password and check it
            //return user not found or build a a token and retrun user imformation
            if(user != null){

                var passwordIsValid = bcrypt.compareSync(reqPassword, user.password);

                if(!passwordIsValid){
                    return res.json({ user: null, status : 201, description : 'Invalid username or password' })
                }

                var token = jwt.sign({ id: user._id }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });

                user.password = null
                user.token = token
                return res.json({ user: user, status : 202, description : 'Login successfully' })
            }
            else{
                return res.json({ user: result, status : 203, description : 'Invalid username or password' })
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
        
        return res.status(200).json({ status : 200, description: 'Logout successfully' });
    }
    else{
        readCollection()
        return res.status(500).json({error : 'connection with DB interupted'})
    }
});

function isValidToken(token, validFunction, invalidFunction){

    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
            invalidFunction();
            return
        }
        
        UserCollection.findById(decoded.id, 
        { password: 0 }, // projection
        function (err, user) {
          if (err){
            invalidFunction();
            return
        }
          if (!user) {
            invalidFunction();
            return
        }
            
         validFunction();
        });
      });
}

module.exports = {
    router,
    isValidToken
}
