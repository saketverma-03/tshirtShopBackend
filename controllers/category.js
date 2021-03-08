const Category = require("../models/category")

// function to give out message if there is an error -> recives message as a paramater
const iferror = (error, message) => {
    if (error) {
        res.status(400).json({
            error: message
        })
    }
}

//---MIDDLEWARE to get catogery by ID and populate it
exports.getCategoryById = (req, res, next, id) => {
    Category.findById(id)
        .exec((error, category) => {
            iferror(error, "Category not found")
            req.category = category;
            next();
        })
}

// other routes controllers

//create
exports.createCategory = (req, res) => {
    console.log("i was called")
    const catogery = new Category(req.body);
    catogery.save((error, catogery) => {
        iferror(error, "Not Able to save the catogery")
        res.json(catogery);
    })
}

// Read
exports.getCategory = (req, res) => {
    return res.json(req.category);
}

exports.getAllCategory = (req, res) => {
    Category.find().exec((error, category) => {
        iferror(error, "unable to get the catogerys")
        res.json(category);
    })
}

//Update
exports.updateCategory = (req, res) => {
    let category = req.category;
    category.name = req.body.name;
    category.save((error, updatedCategory) => {
        iferror(error, "not able to save the updated category")
        res.json(updatedCategory);
    })
}

//delete
exports.removeCategory = (req, res) => {
    let category = req.category;
    category.remove((error ,category) => {
        iferror(error, "not able to delete the category")
        res.json({
            message : `Sucessfully Deleted ${category}`
        })
    })
}