const router = require("express").Router();
const Kurz = require("../models/Kurz");
const { ensureAuthenticated } = require("../auth");

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
    const changePayed = await Kurz.findOne({
      "users._id": req.params.id
    }).then(result => {
      const user = result.users.find(user => user._id == req.params.id);
      return !user.payed;
    });

    await Kurz.findOneAndUpdate(
      {
        "users._id": req.params.id
      },
      {
        $set: {
          "users.$.payed": changePayed
        }
      }
    );
    res.redirect("back");
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:id", ensureAuthenticated, async (req, res) => {
  try {
    await Kurz.findOneAndUpdate(
      {
        "users._id": req.params.id
      },
      {
        $pull: {
          users: {
            _id: req.params.id
          }
        }
      },
      {
        new: true
      }
    );
    res.redirect("back");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
