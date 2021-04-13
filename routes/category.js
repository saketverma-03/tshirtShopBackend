const express = require("express")
const route = express.Router();

const { getCategoryById, createCategory, getCategory, getAllCategory, updateCategory, removeCategory } = require("../controllers/category")
const { isSignedIn, isAuthanticated, isAdmin } = require("../controllers/auth")
const { getUserById } = require("../controllers/user");

//params
route.param("userId", getUserById);
route.param("categoryId", getCategoryById);

//write
route.post("/category/create/:userId", isSignedIn, isAuthanticated, isAdmin, createCategory)

//read-route
route.get("/category/:categoryId", getCategory);
route.get("/categorys", getAllCategory)

//update-route
route.put("category/:category/:userId", isSignedIn, isAuthanticated, isAdmin, updateCategory)

//delete-route
route.delete("category/removeCategory/:category/:userId", isSignedIn, isAuthanticated, isAdmin, removeCategory)

module.exports = route;