const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const salesSchema = newSchema({
    SendStorageId: {
        ref: "Storage",
        required: true,
        type: mongoose.Schema.Types,
    },
    RecieveStorageId: {
        ref: "Store",
        required: true,
        type: mongoose.Schema.Types,
    },
    SendProduct:{
        ref: "Store",
        required: true,
        type:mongoose.Schema.Types,
    },
    Quantity: {type: Number, required: true},
    

    
    dateAt: {type: Date, require: true},
  });

module.exports = mongoose.model('Store', salesSchema);
