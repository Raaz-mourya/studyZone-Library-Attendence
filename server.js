require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const expressLayout = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("express-flash");
const MongoDbStore = require("connect-mongo");
const passport = require("passport");

const PORT = process.env.PORT;

// Database connection
const url = "mongodb://localhost:27017/studyCenter";
mongoose.connect(url);
const connection = mongoose.connection;

connection
  .once("open", function () {
    console.log("Database connected...");
  })
  .on("error", function (err) {
    console.log("Connection failed..." + err);
  });


// Session store
let mongoStore = new MongoDbStore({
  // mongooseConnection: connection,
  mongoUrl: url,
  collection: "sessions",
});

// Session config
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 },
  })
);


//  Passport config
const passportInit = require("./app/config/passport");

passportInit(passport);

app.use(passport.initialize());
app.use(passport.session());



app.use(flash()); //  used to render message without res.render anytime

// Assets
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false })); // to enable form data by name
app.use(express.json()); // to enable json type data

// Global middleware
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});



// set Template engine
app.use(expressLayout);
app.set("views", path.resolve(__dirname, "resources/views"));
app.set("view engine", "ejs");

require("./routes/web")(app); // link seprate route file

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}....`);
});
