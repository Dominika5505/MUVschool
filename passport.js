const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Admin = require("./models/Admin");

module.exports = function(passport) {
  passport.use(
    new LocalStrategy((username, password, done) => {
      Admin.findOne({ name: username })
        .then(admin => {
          if (!admin) {
            return done(null, false, {
              message: "That name is not registered"
            });
          }

          // Match password
          bcrypt.compare(password, admin.password, (err, isMatch) => {
            if (err) console.log(err);

            if (isMatch) {
              return done(null, admin);
            } else {
              return done(null, false, { message: "Password incorrect" });
            }
          });
        })
        .catch(err => console.log(err));
    })
  );

  passport.serializeUser((admin, done) => {
    done(null, admin.id);
  });

  passport.deserializeUser((id, done) => {
    Admin.findById(id, (err, admin) => {
      done(err, admin);
    });
  });
};
