const User = require("../models/user");
const Pet = require("../models/pets");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

//NEED TO ADD VALIDATION

module.exports = {
  createUser: async function ({ userInput }, req) {
    const securePassword = await bcrypt.hash(userInput.password, 12);
    const newUser = new User({
      email: userInput.email,
      firstName: userInput.firstName,
      lastName: userInput.lastName,
      password: securePassword,
    });
    const createUser = await newUser.save(); //saves as new in database
    return { ...createUser._doc, _id: createUser._id.toString() };
  },
  login: async function ({ email, password }, req) {
    const user = await User.findOne({
      email: email,
    });
    if (!user) {
      const error = new Error("No user found!");
      error.code = 401;
      throw error;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      const error = new Error("Password is incorrect!");
      error.code = 401;
      throw error;
    }
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
  user: async function (args, req) {
    if (!req.isAuth) {
      const error = new Error(
        "Not authenticated! Are you sure you're logged in?"
      );
      error.code = 401;
      throw error;
    }
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("User not found.");
      error.code = 401;
      throw error;
    }
    return { ...user._doc, _id: user._id.toString() };
  },
  pet:async function({id},req){
    if (!req.isAuth) {
      const error = new Error(
        "Not authenticated! Are you sure you're logged in?"
      );
      error.code = 401;
      throw error;
    }
    const pet = await Pet.findById(id)
    return{
      ...pet._doc
    }

  },
  createPet: async function ({ petInput }, req) {
    //check if creator is auth
    if (!req.isAuth) {
      const error = new Error("not authenticated");
      error.code = 401;
      throw error;
    }
    const user = await User.findById(req.userId);
    const newPet = new Pet({
      name: petInput.name,
      type: petInput.type,
      phone: petInput.phone,
      owner: user,
    });
    const addedPet = await newPet.save();
    user.pets.push(addedPet);
    await user.save();
    return { ...addedPet._doc };
  },
};
