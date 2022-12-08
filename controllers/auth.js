const User = require("../models/user");
const { validationResult } = require("express-validator"); //validates incoming data to prevent SPAM
const bcrypt = require("bcryptjs"); //encrypts passcodes
const jwt = require("jsonwebtoken"); //sends token with each request

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed!");
    error.statusCode = 422;
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  try {
    const hashedPw = await bcrypt.hash(password, 12);

    const user = new User({
      email: email,
      password: hashedPw,
      name: name,
    });
    const savedUser = await user.save();

    res.status(201).json({ message: "User created!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const validUser = await User.findOne({ email: email });
    if (!validUser) {
      const error = new Error("no email found");
      error.statusCode = 401;
      throw error;
    }
    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword) {
      const error = new Error("Password's don't match");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: validUser.email,
        userId: validUser._id.toString(),
      },
      "secretsecretcode",
      { expiresIn: "2h" }
    );
    res.status(200).json({
      token: token,
      userId: validUser._id.toString(),
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
