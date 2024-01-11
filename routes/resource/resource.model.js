const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const resourceSchema = Schema({
    StorageId: {
      ref: "Storage",
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
    dateAt: { 
      type: Date, 
      require: true 
    }
  });

module.exports = mongoose.model('resource', resourceSchema);
