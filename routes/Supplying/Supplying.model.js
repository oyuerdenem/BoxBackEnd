const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SupplyingSchema = Schema({
  SupplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true,
  },
  WarehouseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
    required: true,
  },
  ProductId: {
    ref: "Product",
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  },
  Quantity: { type: Number, required: true },
  Price: { type: Number, required: true },
  DateAt: { type: Date, require: true }

});

module.exports = mongoose.model('Supplying', SupplyingSchema);
