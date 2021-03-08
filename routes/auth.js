// #AUTHANTICATIN_ROUTES

const express = require("express");
const { signup, signin ,signout ,isSignedIn} = require("../controllers/auth");
const { body } = require('express-validator')


const route = express.Router();

//signup route
route.post("/signup",
    [ //in body email property must be of type email 
      body('email').isEmail().withMessage("Must Be A email"),
      body('password').isLength({ min: 5 }).withMessage("Password Should contain more than 5 character")
    ]
  ,signup); 

//signin route
route.post("/signin",
    [
      body('email').isEmail().withMessage("Must Be A email"),
      // body('password').isLength({ min: 5 }).withMessage("Password Should contain more than 5 character")
    ]
    ,signin);  

//signout route  
route.get("/signout", signout);

//test route
route.get("/test" , isSignedIn ,(req ,res) => {
  res.json(req.auth)
})

module.exports = route;