const mongoose = require("mongoose"); // Erase if already required
// Declare the Schema of the Mongo model
var addressSchema = new mongoose.Schema({
  address: [
    {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  ],
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Address", addressSchema);
