const User = require("../models/user");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

//NEED TO ADD VALIDATION

module.exports = {
  createUser: async function ({ userInput }, req) {
    const securePassword = await bcrypt.hash(userInput.password, 12);
    const newUser = new User({
      email: userInput.email,
      name: userInput.name,
      password: securePassword,
    });
    const createUser = await newUser.save(); //saves as new in database
    return { ...createUser._doc, _id: createUser._id.toString() };
  },
  login: async function ({ email, password }, req) {
    const user = await User.findOne({
      email: email,
    });

    const validPassword = await bcrypt.compare(password, user.password);
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      "secretsecretcode",
      { expiresIn: "2h" }
    );
    return { token: token, userId: user._id.toString() }; // token is used in React
  },
//   createPet: async function ({ petInput }, req) {
//     //check if creator is auth
//     if (!req.isAuth) {
//       const error = new Error("not authenticated");
//       error.code = 401;
//       throw error;
//     }
//     const user = await User.findById(req)
//   },
};
