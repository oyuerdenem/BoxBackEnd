const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name: String,
    required : true,
  });
  
module.exports = mongoose.model('Product', userSchema);