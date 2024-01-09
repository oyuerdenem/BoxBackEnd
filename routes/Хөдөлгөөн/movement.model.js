const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const movementSchema = newSchema({
    sendStorageID: {
      ref: "Storage",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    recieveStorageID: {
      ref: "Storage",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    productID: {
      ref: "Product",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    quantity: {
      type: Number, 
      required: true
    },
    dateAt: {
      type: Date, 
      require: true
    },
  });

module.exports = mongoose.model('Movement', movementSchema);
