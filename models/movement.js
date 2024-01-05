const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const movementSchema = newSchema({
    SendStorageId: {
        ref: "Storage",
        required: true,
        type: mongoose.Schema.Types.ObjectId,
    },
    RecieveStorageId: {
        ref: "Storage",
        required: true,
        type: mongoose.Schema.Types.ObjectId,
      },
      ProductId: {
        ref: "Product",
        required: true,
        type: mongoose.Schema.Types.ObjectId,
      },
    Quantity: {type: Number, required: true},

    dateAt: {type: Date, require: true},
  });

module.exports = mongoose.model('Movement', movementSchema);
