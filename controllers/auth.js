const User = require("../models/users")
const { validationResult, cookie } = require('express-validator');
const jwt = require("jsonwebtoken");
const ejwt = require("express-jwt"); 

// signup route
exports.signup = (req ,res) => {  
    console.log("i was called")
    const errors = validationResult(req); // this validates whether user entere email is of valid type or not

    if (!errors.isEmpty()) {
    console.log(req.body)
    return res.status(400).json({ error: errors.array() });
    }

    const user = new User(req.body)

    user.save((error ,user) => { //---> SaveDAta
        if(error){
            console.log(error)
            return res.status(400).json({
                error : "Unable to carry request"
            })
        }
        res.json(user);
    })
}

//signin route

exports.signin = (req ,res) => {
    const {email ,password} = req.body;     //destructuring the request body
    const errors = validationResult(req);   //--> For validation of that email entered by a user is an email type
    if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0] });
    }

    // findin user with the email
    User.findOne({email} , (error , user) => {
        if(error){
             res.status(400).json({ error : "Email is Not rugistered"})
        }
        if(!user){
            return res.status(400).json({ error : "user with the email does not exist"})
        }
        if(!user.authanticate(password)){
           return res.status(401).json({ error : "Email and Password do not match"})
        }

        // Create Token
        const token = jwt.sign({_id : user._id} , process.env.SECREAT || "saket")
        // send cookie
        res.cookie("token" ,token ,{ expire: new Date() + 9999 })

        //send response to fronend
        const {_id ,email ,name ,role ,} = user;
        return res.json({ token, user : { _id , name ,email ,role}});
    } );
    
}

// signout route 
exports.signout = (req ,res ) => {
    res.clearCookie("token");
    res.json({
        messaage : "user signed out by controoles"
    })}

//===============
//  MIDDLE WARES
//================

//portected routes
exports.isSignedIn = ejwt({
    secret : process.env.SECREAT || "saket",
    userProperty :"auth",
    algorithms : ["HS256"]
})

//custom middlewares
exports.isAuthanticated = (req ,res ,next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id 
    if(!checker){
        res.status(403).json({ error : "ACCESS DENIDE"})
    }
    next();
}

exports.isAdmin = (req ,res ,next) => {
    if(req.profile.role === 0){
        res.status(403).json({ error : "Acess Denied Admin acess required"})
    }
    next();
}
