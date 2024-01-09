const mongoose = require ('mongoose');
const { schema } = require('../Бараа/product');
const Schema = mongoose.Schema;

const withdrawSchema = newSchema({
    SponsorName:{
        type: String,
        ref: "Sponsor",
        required: true,
    },
    ProductId: {
        ref: "Product",
        required: true,
        type: mongoose.Schema.Types.ObjectId,
      },
    
    Quantity: {type: Number, required: true},
    
    dateAt: {type: Date, require: true}

  });

module.exports = mongoose.model('Withdraw', withdrawSchema);
