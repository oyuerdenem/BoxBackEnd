const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const storageSchema = Schema({
  name: {
    type: String,
    required : true
  },
  location:{
    ref: "Storage",
    type: String,
    required : true,
  },
})

module.exports = mongoose.model('Storage', storageSchema);
