const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

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

app.use((error, req, res, next) => {
  //catches all errors thrown by next()
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose //sets up connection to mongoDb
  .connect(
    "mongodb+srv://admin:carltonissott@cluster0.x9rpev1.mongodb.net/test"
  )
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));
