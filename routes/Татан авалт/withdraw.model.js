const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const withdrawSchema = Schema({
  SupplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true,
  },
  StorageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Storage",
    required: true,
  },
  ProductId: {
    ref: "Product",
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  },
  Quantity: { type: Number, required: true },
  Price: { type: Number, required: true },
  dateAt: { type: Date, require: true }

});

module.exports = mongoose.model('Withdraw', withdrawSchema);
