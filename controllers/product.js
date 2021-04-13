const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const product = require("../models/product");

// re-used Function
const iferror = (res, error, message) => {
  if (error) {
    res.status(400).json({
      error: message,
    });
  }
};

//Custom MiddleWare
exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((error, product) => {
      error
        ? iferror(res, error, "Not Able To get the product")
        : (req.product = product);
      next();
    });
};

//Actula Routes

//create
exports.createProduct = (req, res) => {
  console.log("I was called")
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    iferror(res, err, "image file is invalid");

    // Destrecturing the fields
    const { name, description, price, category, stock } = fields;

    //Todo restrictions on fields
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({ error: "Please Enter all th details" });
    }

    let product = new Product(fields);

    //..handel file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "fileSize too big",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    //Save to DB
    product.save((error, product) => {
      error
        ? iferror(res, error, "Saving tshirt to Db failed")
        : res.json({ product });
    });
  });
};

//Read
exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

// +-middele ware to get image
exports.photo = (req, res, next) => {
  if (req.product.photo.id) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  res.json({ error: "no image exist" });
  next();
};

//Update
exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    iferror(res, err, "image file is invalid");

    // Destrecturing the fields
    const { name, description, price, category, stock } = fields;

    let product = req.product;
    product = _.extend(product, fields);

    //..handel file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "fileSize too big",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    //Save to DB
    product.save((error, product) => {
      error
        ? iferror(res, error, "Saving tshirt to Db failed")
        : res.json({ product });
    });
  });
};
exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map((item) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { stock: -item.count, sold: +item.count },
      },
    };
  });

  Product.bulkWrite(myOperations, {}, (error, product) => {
    error ? iferror(res, error, "Bulk  Operations failed") : next();
  });
};

//Delete(remove)
exports.removeProduct = (req, res) => {
  let product = req.prosuct;
  product.remove((error, deletedProduct) => {
    error
      ? iferror(res, error, "failed To delete The product")
      : res.json({ message: "Deletion was a sucess" });
  });
};

//Listing Route
exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  Procduct.find()
    .select("-photo")
    .limit(limit)
    .sort([[sortBy, "asc"]])
    .exce((error, product) => {
      error ? iferror(res, error, "Can Not load products") : res.json(product);
    });
};

exports.getAllCategory = (req, res) => {
  Procduct.distinct("category", {}, (error, categorys) => {
    error ? iferror(res, error, "no category found") : res.json(categorys);
  });
};
