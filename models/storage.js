const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const storageSchema = newSchema({
    name: {
      type: String,
      required : true
    },
    sendlocation:{
        ref: "Storage",
        type: String,
        required : true,
    },
  });

module.exports = mongoose.model('Storage', storageSchema);
