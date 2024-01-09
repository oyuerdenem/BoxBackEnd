const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const sponsorSchema = newSchema({
    name: {
      type: String,
      required : true
    }
  });

module.exports = mongoose.model('Sponsor', SponsorSchema);
