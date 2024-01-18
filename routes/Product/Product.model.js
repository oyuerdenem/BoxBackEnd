const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true
  },
  Image: {
    type: String,
    required: true
  },
  Price: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Product', ProductSchema);