const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const petContent = new Schema({
  type: {
    type: String,
    required: true,
  },
  bullets: [
    {
      type: String,
      required: true,
    },
  ],
  parent: {
    type: Schema.Types.ObjectId,
    ref: "Pet",
    required: true,
  },
});
module.exports = mongoose.model("PetContent", petContent);
