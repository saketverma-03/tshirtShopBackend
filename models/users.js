const mongoose = require("mongoose");
const schema = mongoose.Schema;

const { v1: uuidv1 } = require("uuid");

// ---------------------------------->Node-module
const crypto = require("crypto");

//---->SCHEMA
const userSchema = new schema({
  name: {
    type: String,
    required: true,
    maxlength: 30,
    trim: true,
  },
  lastname: {
    type: String,
    // required: true,
    maxlength: 32,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  hashed_password: {
    type: String,
    // required: true,
  },

  userInfo: String,

  salt: String,

  role: {
    type: String,
    default: 0,
  },

  purchases: {
    type: Array,
    default: [],
  },
});

// ------------------------------------------> UserSchema --Virtulas
userSchema
  .virtual("password")        //here we set the alies name ex. password is virtual here
  .set(function (password) { //whenever password is passed in post reques passord is set to provided password
    const _password = password;
    this.salt = uuidv1();     //sets a unique salt for every user
    this.hashed_password = this.securePassword(password);
  })
  .get(function () {
    return _password;
  });

// ----------------------------------------->userSchema  --Methods
userSchema.methods = {
  //user authantication method
  authanticate: function (plainPassword) {
    return this.securePassword(plainPassword) === this.hashed_password; //returns a bool
  },

  // ----Module to generate sequred Password----
  securePassword: function (plainPassword) {
    if (!plainPassword) {
      return ""
    };
    try {
      const hash = crypto
        .createHmac("sha256", this.salt) // hashing alogo and salt
        .update(plainPassword)   //variable to be hashed
        .digest("hex");
      return hash             // <-----------------------------THIS RIGH HERE returns a hash
    } catch (error) {
      return "";      //if error send empty password so that it can not be saved and genertos error
    }
  },
};

module.exports = mongoose.model("User", userSchema); 
