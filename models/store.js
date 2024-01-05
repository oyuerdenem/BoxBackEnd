const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const storeSchema = newSchema({
      name: {
        type: String,
        required : true,
      },
      location:{
        type:String,
        required : true,
      }
    });

module.exports = mongoose.model('Store', storeSchema);

