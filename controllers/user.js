const User = require("../models/users");
const Order = require("../models/order")

//On request gets user bu id , id comes from param
exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((error, user) => {
        if (error || !user) {
            return res.status(400).json({ error: "user can not be found" })
        }
        req.profile = user;  // profile is userdefined identifier ,its an object that is storing user inside of itself
        next();
    });
}

//Returns Json to the front end
exports.getUser = (req, res) => {
    req.profile.salt = undefined // so that this parameters are not througn in response
    req.profile.hashed_password = undefined

    return res.json(req.profile)
}

//this can be used to update any user properties by the responce body
exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(
        { _id: req.profile._id }
        , { $set: req.body },         //sets or updates user propertys for given id
        { new: true, useFindAndModify: false },
    ).exec((error, user) => {
        if (error) { res.status(400).json({ error: "unable to update DB" }) }
        user.salt = undefined
        user.hashed_password = undefined
        res.json(user)
    })
}

//to get user orderlists
exports.userPurchasesList = (req, res) => {
    Order.findById({ user: req.profile._id })
        .populate("user", "_id name")
        .exec((error, order) => {
            if (error) { return res.status(400).json({ error: "you dont have any orders yet" }) }
            res.json(order)
        })
}

exports.pushOrderInPurchaseList = (req, res, nect) =>{
    
    next();
} 