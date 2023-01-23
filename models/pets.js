const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const petSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content:[{
    type: Schema.Types.ObjectId,
    ref: "PetContent"
  }]
});
module.exports = mongoose.model("Pet", petSchema);
