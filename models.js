const mongoose = require('mongoose');

const entrySchema = mongoose.Schema({
  charity: {type: String, required: true},
  amount: {type: String, required: true},,
  type: {type: String, required: true},,
  url: {type: String, required: true},,
});

entrySchema.methods.apiRepr = function() {
  return {
    id: this._id,
    charity: this.charity,
    amount: this.amount,
    type: this.type,
    url: this.url
  };
}

const Entry = mongoose.model('Entry', entrySchema);

module.exports = {Entry};
