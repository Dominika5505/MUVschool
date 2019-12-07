const router = require("express").Router();
const request = require("request");
const Subscriber = require('../models/Subscriber');
const {
    subscriberValidation
} = require('../validation');

router.get('/', async (req, res) => {
    const subscribers = await Subscriber.find({});
    // const emailExist = subscribers.filter(user => user.email);
    // if (!req.body.js) {
    //     if (emailExist == req.body.email) {
    //         res.redirect('back');
    //     }
    // }
    res.send(subscribers);
})

router.post("/", async (req, res) => {
    // const subscriberEmailExist = Subscriber.findOne({
    //     email: req.body.email
    // }).then(result => console.log(result));

    // if (subscriberEmailExist) {

    // }

    if (!req.body.js) {
        const {
            error
        } = subscriberValidation(req.body);
        if (error) {
            res.redirect('back');
        }
    } else {
        const newSubscriber = new Subscriber({
            name: req.body.name,
            email: req.body.email
        });

        try {
            await newSubscriber.save();
            req.flash("success_msg", "Si prihlásený na odber noviniek!");
            res.redirect("back");
        } catch (err) {
            console.log(err)
        }
    }

});

module.exports = router;