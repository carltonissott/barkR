const User = require("../models/user");
const Pet = require("../models/pets");
const PetContent = require('../models/content')
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
ObjectId = require("mongodb").ObjectId;

//NEED TO ADD VALIDATION

module.exports = {
  createUser: async function ({ userInput }, req) {
    const securePassword = await bcrypt.hash(userInput.password, 12);
    const newUser = new User({
      email: userInput.email,
      firstName: userInput.firstName,
      lastName: userInput.lastName,
      password: securePassword,
      street: userInput.street,
      city: userInput.city,
      zip: userInput.zip,
      tel: userInput.tel,
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
  pet: async function ({ id }, req) {
    if (!req.isAuth) {
      const error = new Error(
        "Not authenticated! Are you sure you're logged in?"
      );
      error.code = 401;
      throw error;
    }
    const pet = await Pet.findById(id);
    return {
      ...pet._doc,
      id: pet._id.toString(),
      image: "http://localhost:8080/" + pet.image,
    };
  },
  content: async function ({ id }, req) {
    if (!req.isAuth) {
      const error = new Error(
        "Not authenticated! Are you sure you're logged in?"
      );
      error.code = 401;
      throw error;
    }
    const content = await PetContent.findById(id);
    return {
      ...content._doc,
      id: content._id.toString(),
    };
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
      image: petInput.image,
      description: petInput.description,
      owner: user,
    });
    const addedPet = await newPet.save();
    user.pets.push(addedPet);
    await user.save();
    return { ...addedPet._doc };
  },

  updatePetContent: async function ({id, content}, req){
    if (!req.isAuth) {
      const error = new Error("not authenticated");
      error.code = 401;
      throw error;
    }
    const pet = await Pet.findById(id);
    const newContent = new PetContent({
      type: content.type,
      bullets: content.bullets,
      parent: pet
    })
    const addedContent = await newContent.save()
    pet.content.push(addedContent)
    await pet.save()
    return {...addedContent._doc}
  },

  updatePet: async function ({ id, petInput }, req) {
    if (!req.isAuth) {
      const error = new Error("not authenticated");
      error.code = 401;
      throw error;
    }
    const pet = await Pet.findById(id);
    if (petInput.description) {
      pet.description = petInput.description;
    }
    if (petInput.image) {
      pet.image = petInput.image;
    }
    const updatedPet = await pet.save();
    return { ...updatedPet._doc };
  },



  updateUser: async function ({ userInput }, req) {
    if (!req.isAuth) {
      const error = new Error("not authenticated");
      error.code = 401;
      throw error;
    }
    const user = await User.findById(req.userId);
    user.email = userInput.email;
    user.firstName = userInput.firstName;
    user.lastName = userInput.lastName;
    user.street = userInput.street;
    user.zip = userInput.zip;
    user.tel = userInput.tel;
    const updatedUser = await user.save();
    return { ...updatedUser._doc };
  },
  deleteUser: async function ({ id }, req) {
    if (!req.isAuth) {
      const error = new Error("not authenticated");
      error.code = 401;
      throw error;
    }
    await Pet.deleteMany({ owner: ObjectId(id) });
    await User.findByIdAndDelete(id);
    return true;
  },
  deletePet: async function ({ petId }, req) {
    if (!req.isAuth) {
      const error = new Error("not authenticated");
      error.code = 401;
      throw error;
    }
    //check to make sure owner is the same owner
    const pet = await Pet.findById(petId);

    if (pet.owner.toString() !== req.userId) {
      const error = new Error("Not your pet!");
      error.code = 401;
      throw error;
    }
    //delete pet from user

    const user = await User.findById(req.userId);

    const index = user.pets.findIndex((id) => id == petId);
    user.pets.splice(index, 1);

    const updatedUser = await user.save();

    //delete pet from database
    await Pet.findByIdAndDelete(petId);

    return true;
  },
  lookupPet: async function ({ id }, req) {
    try {
      const pet = await Pet.findById(id);
      return pet
    } catch (error) {
      const err = new Error("No pet found!");
      err.code = 404;
      throw err;
    }
  },
 
};
