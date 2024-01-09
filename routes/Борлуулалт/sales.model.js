const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const salesSchema = Schema({
    SendStorageId: {
        ref: "Storage",
        required: true,
        type: mongoose.Schema.Types,
    },
    RecieveStoreId: {
        ref: "Store",
        required: true
    },
    SendProduct:{
        ref: "Product",
        required: true,
        type:mongoose.Schema.Types,
    },
    Quantity: {type: Number, required: true},
    dateAt: {type: Date, require: true}
  });

module.exports = mongoose.model('Store', salesSchema);
