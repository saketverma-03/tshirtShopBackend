const express = require("express");
const route = express.Router();

const { getUserById, getUser ,updateUser ,userPurchasesList} = require("../controllers/user");
const { isAdmin, isAuthanticated, isSignedIn } = require("../controllers/auth");

route.param("userId", getUserById);

//gets userId from params the passes to route param,

//used to get user
route.get("/user/:userId", isSignedIn, isAuthanticated ,getUser);

//used to update user info from request body
route.put("/user/:userId", isSignedIn, isAuthanticated ,updateUser);

//gives all the orders the users have made so far.......
route.put("/user/orders/:userId", isSignedIn, isAuthanticated ,userPurchasesList);

module.exports = route;
