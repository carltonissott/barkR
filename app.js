const path = require("path");

const User = require("./models/user");
const Pet = require("./models/pets")

const nodemailer = require("nodemailer");

const auth = require("./middleware/isAuth");
const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolvers");

const stripe = require("stripe")(
  "sk_test_51MZ0QdIyEliCATcCym8HgUc0TBwNemt3QindmoBU9qEXyuL72tUjJAGi8r64UsPeOglkJoH7qLfMhbHMoEzdNWb900sqSATQve"
);

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

app.post("/create-checkout-session", async (req, res, next) => {
  const { priceId } = req.body;

  const user = await User.findById(req.userId);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: user.stripeId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url:
      "http://localhost:3000/dashboard/myprofile?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "http://localhost:3000/dashboard/myprofile",
  });
  return res.json({ url: session.url });
});

app.post("/webhook", async (req, res) => {
  let data;
  let eventType;
  // Check if webhook signing is configured

  data = req.body.data;
  eventType = req.body.type;
  const customer = data.object.customer;

  let user = await User.findOne({
    stripeId: customer,
  });

  switch (eventType) {
    case "checkout.session.completed":
      user.membership = true;

      await user.save();

      break;
    case "invoice.paid":
      user.membership = true;

      await user.save();

      break;
    case "invoice.payment_failed":
      user.membership = false;

      await user.save();

      break;
    case "customer.subscription.paused":
      user.membership = false;

      await user.save();

      break;

    case "customer.subscription.deleted":
      user.membership = false;

      await user.save();

      break;

    default:
    // Unhandled event type
  }

  res.sendStatus(200);
});

app.post("/customer-portal", async (req, res, next) => {
  const user = await User.findById(req.userId);

  const returnUrl = "http://localhost:3000/dashboard/myprofile";

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeId,
    return_url: returnUrl,
  });
  return res.json({ url: portalSession.url });
});

app.post("/email-notification", async (req, res, next) => {
  let testAccount = await nodemailer.createTestAccount();


  const { petId } = req.body;

  console.log(req.ip)

  const pet = await Pet.findById(petId)
  const owner = await User.findById(pet.owner)

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: owner.email, // list of receivers
    subject: "Hello ✔", // Subject line
    text: `"Your pet has been scanned! ${req.ip}"`, // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  
  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
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
