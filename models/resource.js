const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const resourceSchema = newSchema({
    ProductId: {
        ref: "Product",
        required: true,
        type: mongoose.Schema.Types.ObjectId,
      },
    SendStorageId: {
        ref: "Storage",
        required: true,
        type: mongoose.Schema.Types.ObjectId,
      },
    Quantity: {type: Number, required: true}
  });

module.exports = mongoose.model('resource', resourceSchemaSchema);
