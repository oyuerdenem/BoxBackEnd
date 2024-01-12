const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const WarehouseSchema = Schema({
  Name: {
    type: String,
    required : true
  },
  Location:{
    type: String,
    required : true,
  },
})

module.exports = mongoose.model('Warehouse', WarehouseSchema);
