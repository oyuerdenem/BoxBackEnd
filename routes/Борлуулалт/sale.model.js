const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const saleSchema = Schema({
    storageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Storage",
        required: true
    },
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    dateAt: { type: Date, require: true }
  });

module.exports = mongoose.model('Sale', saleSchema);
