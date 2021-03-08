const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchem = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
    },
    description: {
        type: String,
        trim: true,
        required: true,
        maxlength: 500,
    },
    price: {
        type: Number,
        trim: true,
        required: true
    },
    category: {
        type: ObjectId,
        ref: "Category"
    },
    stock: {
        type: Number
    },
    sold: {
        type: Number,
        default: 0
    },
    photo: {
        data: Buffer,
        content: String
    }
},
{ timestamps: true }
)

module.exports = mongoose.model("Product", productSchem);