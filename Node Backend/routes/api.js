const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')

const Hacker = require('../model/votingSchema');
const User = require('../model/votingSchema');

// Import dummy data from json for hacker and end user 
const Hackerjson = require('../model/hackerData.json');
const Userjson = require('../model/UserData.json');

const ROLE ={
  ADMIN: "admin",
  USER : "user"
}

// Scheduler Run To refresh  DB data When the application Up..
Hacker.Hackerscheduler(Hackerjson, function (err, result) {
  if (err)
    throw err;
  console.log("Hacker Scheduler Executed...");
});

// Scheduler Run To refresh  DB data When the application Up..
User.Userscheduler(Userjson, function (err, result) {
  if (err)
    throw err;
  console.log("User Scheduler Executed...");
});

// verfiy token muiddleware check authorization of end user
/**
 * We are using jwt for authorization of user and admin.
 */
function verifyToken(req, res, next) {
  if(!req.headers.authorization) {
    return res.status(401).send('Unauthorized User')
  }
  let token = req.headers.authorization.split(' ')[1]
  if(token === 'null') {
    return res.status(401).send('Unauthorized User')    
  }
  let payload = jwt.verify(token, 'secretKey')
  if(!payload) {
    return res.status(401).send('Unauthorized User')    
  }
  req.userId = payload.subject;
  req.email= payload.email;
  next()
}

//  authAdmin muiddleware check authorization of admin
function authAdmin(req, res, next) {
  if(!req.headers.authorization) {
    return res.status(401).send('Unauthorized request')
  }
  let token = req.headers.authorization.split(' ')[1]
  if(token === 'null') {
    return res.status(401).send('Unauthorized request')    
  }
  let payload = jwt.verify(token, 'secretKey')
  if(!payload) {
    return res.status(401).send('Unauthorized request')    
  }
  req.userId = payload.subject;
  req.email= payload.email;

  // role is different for admin.
  if(payload.role!=ROLE.ADMIN)
      return res.status(401).send('Unauthorized request')  
  req.role = payload.role;
  next()
}


// Api to get all candidates who participated (Hacker)
router.get('/getCandidates', verifyToken , function (req, res) {
  Hacker.getHackers(function(err, result){
    if(err)
      throw err;
    res.send(result);
  });

})


// Patch Api to update the vote of the hacker. 
router.patch('/incrementVote', verifyToken,  function (req, res) {

  /**
   * A End user can vote only once.
   * Here we check Db flag (eligible_for_vote) to check wether a user allowed for vote or not.
   */
   User.findOne({email: req.email}, async function(err,result){
    if(err)
      throw err;
    if(result.eligible_for_vote!=true){
      res.status(401).send("You can Vote Only Once");
    }
    else{

    // If user allowed then update vote 
      await Hacker.updateVote(req.body,function(err, result){
        if(err)
          throw err;
          res.status(200);
      })

      // After updating the parameter change the flag to false (eligible_for_vote)
      /**
       * Every time we dont hit Db for check the who can vote.
       * Also put a flag in client site local storage.
       * If someone change that then forecfully it will come to backend part.
       */
      User.updateOne({email: req.email}, {$set: {eligible_for_vote: false}}, function(err,result){
        if(err)
          throw err;
      });
    }
  })
  
})

// Api to delete the candidate (Hacker). Only admin can delete. We ensure that with authAdmin middleware.
router.post('/delete', authAdmin , function(req, res){
  Hacker.deleteHacker(req.body, (err, result)=>{
    if(err)
      throw err;
    res.status(200).send({msg: "Deleted Successfully"});
  });
})



// Api to update the candidate (Hacker). Only admin can update. We ensure that with authAdmin middleware.
router.put('/updateCandidate', authAdmin , function(req, res){
  Hacker.updateHacker(req.body, (err, result)=>{
    if(err)
      throw err;
    res.status(200).send({msg: "Updated Successfully"});
  });
})


// Api to add the candidate (Hacker). Only admin can add. We ensure that with authAdmin middleware.
router.post('/addCandidate', authAdmin , function(req, res){
  Hacker.addHacker(req.body, (err, result)=>{
    if(err)
      throw err;
    res.status(200).send({msg: "Added Successfully"});
  });
})

// Api to login. Only registered user can login.

/**
 * We make this api mor feasible by using bcrpty password and passport authentication.
 */
router.post('/login', (req, res) => {
  let userData = req.body
  console.log(userData.email);
  User.findOne({email: userData.email}, (err, user) => {
    if (err) {
      throw err;  
    } else {
      if (!user) {
        res.status(401).send('Invalid Email')
      } else 
      if ( user.password !== userData.password) {
        res.status(401).send('Invalid Password')
      } else {
        // When user login a jwt token assign with the user that help to give authorization

        let payload = {subject: user._id, email: user.email, role : user.role}
        let token = jwt.sign(payload, 'secretKey')
        let result ={
          token : token,
          role: user.role,
          eligible_for_vote: user.eligible_for_vote
        }
        res.send(result);
      }
    }
  })
})

module.exports = router;