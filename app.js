const path = require("path");

const auth = require("./middleware/isAuth");
const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolvers");

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const app = express();
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json());

app.use(multer({ storage: storage, fileFilter: fileFilter }).single("image"));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  //fixes COORs problem
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(auth); //authorizes all requests

app.post("/post-image", (req, res, next) => {
  if (!req.isAuth) {
    throw new Error("Not authenticated");
  }
  if (!req.file) {
    return res.status(200).json({ message: "No file provided!" });
  }
  return res
    .status(201)
    .json({ message: "File stored!", filePath: req.file.path });
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    customFormatError(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || "An error occurred.";
      const code = err.originalError.code || 500;
      return { message: message, status: code, data: data };
    },
  })
);

app.use((error, req, res, next) => {
  //catches all errors thrown by next()
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .set("strictQuery", false) //sets up connection to mongoDb
  .connect(
    "mongodb+srv://admin:carltonissott@cluster0.x9rpev1.mongodb.net/test"
  )

  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));
