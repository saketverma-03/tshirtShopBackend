const express = require("express")
const route = express.Router();

const { getProductById, createProduct, getProduct, photo, removeProduct, updateProduct, getAllProducts, getAllCategory } = require("../controllers/product");
const { isSignedIn, isAuthanticated, isAdmin } = require("../controllers/auth")
const { getUserById } = require("../controllers/user");

// Params
route.param("productId", getProductById);
route.param("userId", getUserById);

// Actual Routes
route.post("/product/create/:userId", isSignedIn, isAuthanticated, isAdmin, createProduct)

// Read
route.get("/product/create/:productId", getProduct)
route.get("/product/photo/:productId", photo);

// Delete-Route
route.delete("/product/:productId/:userId", isSignedIn, isAuthanticated, isAdmin, removeProduct)

//Update-Route
route.put("/product/:productId/:userId", isSignedIn, isAuthanticated, isAdmin, updateProduct)

//Listing Route
route.get("/ptoduct/getAllProducts", getAllProducts)
route.get("/product/getAllCategory", getAllCategory)

module.exports = route;