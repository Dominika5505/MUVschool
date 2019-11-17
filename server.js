if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require("express");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require('connect-mongo')(session);
const passport = require("passport");
require("./passport")(passport);

const app = express();

// Use static folders
app.use(express.static(path.join(__dirname, "public")));

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// Body parser
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log("Connected to database..."))
  .catch(err => console.log(err));

// Session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 2 * 24 * 60 * 60
    })
  })
);

// CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global Vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Method Override
app.use(methodOverride("_method"));

console.log(typeof process.env.DATABASE_URI);

// Routers
app.use("/", require("./routes/index"));
app.use("/services", require("./routes/registerForm"));
app.use("/admin", require("./routes/admin"));
app.use("/admin/dashboard", require("./routes/adminDashboard"));

// Listening on port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server is running on port 5000"));