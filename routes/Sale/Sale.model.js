const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const SaleSchema = Schema({
    WarehouseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Warehouse",
        required: true
    },
    StoreId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
        required: true
    },
    ProductId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    Quantity: { type: Number, required: true },
    Price: { type: Number, required: true },
    DateAt: { type: Date, require: true }
  });

module.exports = mongoose.model('Sale', SaleSchema);
