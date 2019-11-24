const router = require("express").Router();
const Kurz = require("../models/Kurz");
const {
  ensureAuthenticated
} = require("../config/auth");
const transporter = require('../config/nodemailerAuth');
const ejs = require('ejs');

router.get("/", ensureAuthenticated, async (req, res) => {
  // level2.forEach(inter => {
  //     console.log(inter.parent[0].parentFirstName)
  // });
  const level1 = await Kurz.findOne({
    name: "Level 1"
  }).then(result => {
    return result.users;
  });

  const usersPayedLevel1 = level1.filter(user => {
    return user.payed == true;
  });

  const usersPayedCountLevel1 = usersPayedLevel1.length;
  // level1.forEach(inter => {
  //     console.log(inter);
  // })
  res.render("level1", {
    title: "Admin/Level 1",
    level1,
    usersPayedCountLevel1
  });
});

router.get("/level2", ensureAuthenticated, async (req, res) => {
  const level2 = await Kurz.findOne({
    name: "Level 2"
  }).then(result => {
    return result.users;
  });

  const usersPayedLevel2 = level2.filter(user => {
    return user.payed == true;
  });

  const usersPayedCountLevel2 = usersPayedLevel2.length;

  res.render("level2", {
    title: "Admin/Level 2",
    level2,
    usersPayedCountLevel2
  });
});

router.put("/:id", ensureAuthenticated, async (req, res) => {
  try {
    const user = await Kurz.findOne({
      "users._id": req.params.id
    }).then(result => {
      const user = result.users.find(user => user._id == req.params.id);
      return user;
    });

    const changePayed = !user.payed;

    await Kurz.findOneAndUpdate({
      "users._id": req.params.id
    }, {
      $set: {
        "users.$.payed": changePayed
      }
    });
    const data = await ejs.renderFile(
      process.cwd() + "/views/emailPayed.ejs");

    const mailList = `${user.email}, ${user.parent.parentEmail}`;

    let mailOptions = {
      from: "MUVschool <muvschool@gmail.com>",
      to: mailList,
      subject: "Potvrdenie registrácie",
      attachments: [{
        filename: "LOGOBlack.png",
        path: "./public/images/LOGOBlack.png",
        cid: "logo"
      }],
      html: data
    };

    if (changePayed) {
      transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
          console.log("Error Occurs: ", err);
        } else {
          console.log("Email sent!!!");
        }
      });
    }
    res.redirect("back");
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:id", ensureAuthenticated, async (req, res) => {
  try {
    await Kurz.findOneAndUpdate({
      "users._id": req.params.id
    }, {
      $pull: {
        users: {
          _id: req.params.id
        }
      }
    }, {
      new: true
    });
    res.redirect("back");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;