const router = require("express").Router();
const Kurz = require("../models/Kurz");
const {
    userValidation
} = require("../validation");
const fs = require('fs');
const ejs = require('ejs');
const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

router.post("/", async (req, res) => {
    let errors = [];
    // const newCourse = new Kurz({
    //     name: 'Pokročilí',
    //     users: []
    // });
    // await newCourse.save();

    // Validate
    const {
        error
    } = userValidation(req.body);
    if (error) {
        errors.push({
            msg: error.details[0].message
        });
    }

    if (req.body.checkbox == false) {
        errors.push({
            msg: "Musíš súhlasiť s obchodnými podmienkami!"
        });
    }

    if (req.body.pickCourse == "Level 1") {
        let calc = 2020 - req.body.dobYear;

        const level1 = await Kurz.findOne({
            name: 'Level 1'
        }).then(result => {
            return result.users;
        });

        const usersPayedLevel1 = level1.filter(user => {
            return user.payed == true;
        });

        const usersPayedCountLevel1 = usersPayedLevel1.length;

        if (calc > 12) {
            errors.push("Level 1 je do 12 rokov!");
        } else if (usersPayedCountLevel1 > 5) {
            errors.push('Kurz je už plný!')
        }
    }

    if (req.body.pickCourse == "Level 2") {
        let calc = 2020 - req.body.dobYear;

        const level2 = await Kurz.findOne({
            name: 'Level 2'
        }).then(result => {
            return result.users;
        });

        const usersPayedLevel2 = level2.filter(user => {
            return user.payed == true;
        });

        const usersPayedCountLevel2 = usersPayedLevel2.length;

        if (calc <= 12) {
            errors.push("Level 2 je nad 12 rokov!");
        } else if (calc > 16) {
            errors.push("Level 2 je do 16 rokov!");
        } else if (usersPayedCountLevel2 > 18) {
            errors.push('Kurz je už plný!')
        }
    }


    if (errors.length > 0) {
        res.send(errors);
    } else {

        const kurz = await Kurz.findOne({
                name: req.body.pickCourse
            })
            .then(kurz => {
                return kurz
            }).catch(err => console.log(err));
        console.log(req.body.pickCourse);
        const convertPhoneNum = phoneNum => {
            const lastThreeDigits = String(phoneNum)
                .replace(/\s+/g, "")
                .slice(-3);
            const middleThreeDigits = String(phoneNum)
                .replace(/\s+/g, "")
                .slice(-6)
                .slice(0, 3);
            const firstDigits = String(phoneNum)
                .replace(/\s+/g, "")
                .slice(0, -6);
            return `${firstDigits} ${middleThreeDigits} ${lastThreeDigits}`;
        };

        const convertPSC = PSC => {
            const firstDigits = String(PSC)
                .replace(/\s+/g, "")
                .slice(0, 3);
            const lastDigits = String(PSC).replace(/\s+/g, "").slice(-2);
            return `${firstDigits} ${lastDigits}`;
        };

        console.log(convertPSC(req.body.PSC));

        kurz.users.push({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dob: `${req.body.dobDay}.${req.body.dobMonth}.${req.body.dobYear}`,
            email: req.body.email,
            phoneNum: convertPhoneNum(req.body.phoneNum),
            address: req.body.address,
            city: req.body.city,
            PSC: convertPSC(req.body.PSC),
            state: req.body.state,
            inf: req.body.inf,
            parent: {
                parentFirstName: req.body.parentFirstName,
                parentLastName: req.body.parentLastName,
                parentEmail: req.body.parentEmail,
                parentPhoneNum: convertPhoneNum(req.body.parentPhoneNum),
                parentInf: req.body.parentInf
            }
        });
        console.log("Worked");
        kurz
            .save()
            .then(console.log(kurz.users))
            .catch(err => console.log(err));
        console.log(req.body.pickCourse === kurz.name);
        console.log(kurz.users);

        const data = await ejs.renderFile(process.cwd() + "/views/emailTemplate.ejs", {
            user: req.body,
            PSC: convertPSC(req.body.PSC),
            phoneNum: convertPhoneNum(req.body.phoneNum),
            parentPhoneNum: convertPhoneNum(req.body.parentPhoneNum),
        });

        const mailList = `${req.body.email}, ${req.body.parentEmail}`;

        let mailOptions = {
            from: "muvschool@gmail.com",
            to: mailList,
            subject: "MUVschool - Prihláška na kurz",
            attachments: [{
                filename: 'LOGOBlack.png',
                path: './public/images/LOGOBlack.png',
                cid: 'logo'
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


        res.render("services", {
            user: req.body,
            title: "Services"
        });
    }


});

module.exports = router;