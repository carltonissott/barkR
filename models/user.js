const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  zip: {
    type: String,
    required: false,
  },
  tel: {
    type: String,
    required: true,
  },
  stripeId: {
    type: String,
    required: true,
  },
  membership: {
    type: Boolean,
    required: false,
  },
  lat: {
    type: String,
    required: true,
  },
  long: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },

  pets: [
    {
      type: Schema.Types.ObjectId,
      ref: "Pet",
    },
  ],
});

module.exports = mongoose.model("Users", userSchema);
