const router = require("express").Router();
const Admin = require("../models/Admin");
const { adminValidation } = require("../validation");
const bcrypt = require("bcryptjs");
const passport = require("passport");

router.get("/", (req, res) => {
  res.render("login", {
    title: "Admin"
  });
});

// LOGIN

router.post("/", async (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/admin/dashboard",
    failureRedirect: "/admin",
    failureFlash: true
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success_msg", "Si odhlásený");
  res.redirect("/admin");
});

module.exports = router;
