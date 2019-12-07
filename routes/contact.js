const router = require('express').Router();
const transporter = require('../config/nodemailerAuth');
const {
    contactValidation
} = require('../validation');
const ejs = require('ejs');

router.get('/', (req, res) => {
    res.render('contact', {
        title: 'Kontakt'
    })
});

router.post('/', async (req, res) => {
    console.log(req.body);
    let errors = [];
    // const newCourse = new Kurz({
    //     name: 'Level 1',
    //     users: []
    // });
    // await newCourse.save();
    // new Kurz({
    //     name: 'Level 2',
    //     users: []
    // }).save();

    // Validate
    const {
        error
    } = contactValidation(req.body);

    // ----------------
    if (error) {
        const errorMsg = error.details[0].message;
        console.log(errorMsg.slice(-40));

        if (errorMsg == '"email" must be a valid email') {
            errors.push({
                msg: "Email nie je správny."
            });
        }
        if (
            errorMsg.slice(-92) ==
            "match the required pattern: /^(?:[A-zÀ-ú]+)(?:[A-Za-z0-9\\u0100-\\u017F .,:?!áéíýóúô]*)$/"
        ) {
            errors.push({
                msg: "Správa musia obsahobať len čísla písmená . , : ? a !."
            });
        }

        if (
            errorMsg.slice(-41) == "length must be at least 2 characters long" ||
            errorMsg.slice(-40) == "less than or equal to 50 characters long" ||
            errorMsg.slice(-78) ==
            "match the required pattern: /^(?:[A-zÀ-ú]+)(?:[A-Za-z\\u0100-\\u017Fáéíýóúô]*)$/"
        ) {
            errors.push({
                msg: "Meno musí obsahovať len písmená v počte od 2 do 50."
            });
        }

        if (error) {
            errors.push({
                msg: error.details[0].message
            });
        }

        if (
            errorMsg.slice(-26) == "is not allowed to be empty"
        ) {
            errors.push({
                msg: "Všetky polia označené * musia byť vyplnené alebo zaškrtnuté."
            });
        }

        // ----------------
    }

    if (errors.length > 0) {
        console.log(errors);
        res.render("contact", {
            errors,
            title: "Contact",
            contactMsg: req.body.contactMsg,
            contactFirstName: req.body.contactFirstName,
            contactLastName: req.body.contactLastName,
            contactEmail: req.body.contactEmail,
            contactSubject: req.body.contactSubject,
        });
    } else {

        const data = await ejs.renderFile(
            process.cwd() + "/views/emailContact.ejs", {
                user: req.body,
            }
        );

        let mailOptions = {
            from: `${req.body.contactFirstName} ${req.body.contactLastName} <${req.body.contactEmail}>`,
            to: 'muvschool@gmail.com',
            subject: req.body.contactSubject,
            attachments: [{
                filename: "LOGOBlack.png",
                path: "./public/images/LOGOBlack.png",
                cid: "logo"
            }],
            html: data
        };

        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                console.log("Error Occurs: ", err);
            } else {
                console.log("Email sent!!!");
            }
        });

        res.render('contact', {
            title: 'Kontact',
            success_msg: 'Ďakujeme, formulár bol odoslaný'
        })
    }


})

module.exports = router;