const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovementSchema = Schema({
  SendWarehouseId: {
    ref: "Warehouse",
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  },
  RecieveWarehouseId: {
    ref: "Warehouse",
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  },
  ProductId: {
    ref: "Product",
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  },
  Quantity: {
    type: Number,
    required: true
  },
  DateAt: {
    type: Date,
    require: true
  },
});

module.exports = mongoose.model('Movement', MovementSchema);
