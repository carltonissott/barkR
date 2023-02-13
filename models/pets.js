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
  description: {
    type: String,
    required: true,
  },
  breed: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  birth: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  emailNotification: {
    type: Boolean,
    required: false,
  },
  lost: {
    type: Boolean,
    required: false,
  },
  content: [
    {
      type: Schema.Types.ObjectId,
      ref: "PetContent",
    },
  ],
});
module.exports = mongoose.model("Pet", petSchema);
