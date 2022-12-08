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
  name: {
    type: String,
    required: true,
  },
  pets: [
    {
      type: Schema.Types.ObjectId,
      ref: "Pets",
    },
  ],
});

module.exports = mongoose.model("Users", userSchema);
