const router = require("express").Router();
const Admin = require("../models/Admin");
const {
  adminValidation
} = require("../validation");
const bcrypt = require("bcryptjs");
const passport = require("passport");

router.get("/", (req, res) => {
  res.render("login", {
    title: "Admin"
  });
});

// LOGIN

router.post("/", async (req, res, next) => {
  let errors = [];

  const {
    error
  } = adminValidation(req.body);

  if (error) {
    errors.push({
      msg: error.details[0].message
    });
  }

  if (errors.length > 0 && req.body.pickCourse == "Level 1") {
    console.log(errors);
    res.render("login", {
      errors,
    })
  } else {
    passport.authenticate("local", {
      successRedirect: "/admin/dashboard",
      failureRedirect: "/admin",
      failureFlash: true
    })(req, res, next);
  }

});

router.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success_msg", "Si odhlásený");
  res.redirect("/admin");
});

module.exports = router;