const router = require("express").Router();
const Kurz = require("../models/Kurz");
const {
    userValidation
} = require("../validation");
const fs = require("fs");
const ejs = require("ejs");
const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        type: "oauth2",
        user: process.env.EMAIL_USER,
        // pass: process.env.EMAIL_PASS
        clientId: "659853386415-gqglol5od0l1j9o7k4fdepor9ce14c89.apps.googleusercontent.com",
        clientSecret: "ETnxkaDa_HqDlGYUIZcxBX_a",
        refreshToken: "1//04qNStbFqsTGCCgYIARAAGAQSNwF-L9Irv3qoT8Y05lPvSLFaq-4WX5xbQAVTeTVStwnm3Z8pvCL4jwVXjirFAGJWoWsabuuBxIU"
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



    // ----------------
    const errorMsg = error.details[0].message;
    console.log(errorMsg.slice(-40));
    if (errorMsg.slice(-26) == 'is not allowed to be empty' || req.body.pickCourse !== "Level 1" || req.body.pickCourse !== "Level 1") {
        errors.push({
            msg: 'Všetky polia označené * musia byť vyplnené alebo zaškrtnuté.'
        })
    }
    if (errorMsg == '"dobDay" must be less than or equal to "1970-01-01T00:00:00.031Z"') {
        errors.push({
            msg: 'Deň narodenia musí obsahovať číslo 1-31.'
        })
    }
    if (errorMsg == '"dobMonth" must be larger than or equal to "1970-01-01T00:00:00.001Z"') {
        errors.push({
            msg: 'Prosím zadaj mesiac narodenia.'
        })
    }
    if (errorMsg == '"email" must be a valid email') {
        errors.push({
            msg: 'Email nie je validný.'
        })
    }
    if (errorMsg.slice(-60) == 'fails to match the required pattern: /^[+]?[()/0-9. -]{9,}$/') {
        errors.push({
            msg: 'Telefónne číslo nie je správne.'
        })
    }
    if (errorMsg.slice(-84) == 'fails to match the required pattern: /^(?:[A-zÀ-ú]+)(?:[A-Za-z0-9\\u0100-\\u017F ]*)$/') {
        errors.push({
            msg: 'Adresa nie je správna.'
        })
    }
    if (errorMsg.slice(-49) == `fails to match the required pattern: /^[0-9\\s]*$/`) {
        errors.push({
            msg: 'PSČ nie je správna.'
        })
    }
    if (errorMsg.slice(-72) == 'match the required pattern: /^(?:[A-zÀ-ú]+)(?:[A-Za-z\\u0100-\\u017F ]*)$/') {
        errors.push({
            msg: 'Mesto nie je správne.'
        })
    }
    if (errorMsg.slice(-41) == 'length must be at least 2 characters long' || errorMsg.slice(-40) == 'less than or equal to 50 characters long' || errorMsg.slice(-71) == 'match the required pattern: /^(?:[A-zÀ-ú]+)(?:[A-Za-z\\u0100-\\u017F]*)$/') {
        errors.push({
            msg: 'Meno musí obsahovať validné znaky v počte od 2 do 50.'
        })
    }

    if (error) {
        errors.push({
            msg: error.details[0].message
        });
    }


    // ----------------


    if (errorMsg == '"checkbox" is required' || errorMsg == '"checkboxGDPR" is required') {
        errors.push({
            msg: "Musíš súhlasiť s obchodnými podmienkami a so spracovaním osobných údajov!"
        });
    }

    if (req.body.pickCourse == "Level 1") {
        let calc = 2020 - req.body.dobYear;

        const level1 = await Kurz.findOne({
            name: "Level 1"
        }).then(result => {
            return result.users;
        });

        const usersPayedLevel1 = level1.filter(user => {
            return user.payed == true;
        });

        const usersPayedCountLevel1 = usersPayedLevel1.length;

        if (calc > 12) {
            errors.push({
                msg: "Level 1 je do 12 rokov!"
            });
        } else if (usersPayedCountLevel1 > 5) {
            errors.push({
                msg: "Kurz je už plný!"
            });
        }
    }

    if (req.body.pickCourse == "Level 2") {
        let calc = 2020 - req.body.dobYear;

        const level2 = await Kurz.findOne({
            name: "Level 2"
        }).then(result => {
            return result.users;
        });

        const usersPayedLevel2 = level2.filter(user => {
            return user.payed == true;
        });

        const usersPayedCountLevel2 = usersPayedLevel2.length;

        if (calc <= 12) {
            errors.push({
                msg: "Level 2 je nad 12 rokov!"
            });
        } else if (calc > 16) {
            errors.push("Level 2 je do 16 rokov!");
        } else if (usersPayedCountLevel2 > 18) {
            errors.push({
                msg: "Kurz je už plný!"
            });
        }
    }

    if (errors.length > 0) {
        console.log(errors);
        res.render('services', {
            errors,
            title: 'Tréningy',
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dobDay: req.body.dobDay,
            dobMonth: req.body.dobMonth,
            dobYear: req.body.dobYear,
            email: req.body.email,
            phoneNum: req.body.phoneNum,
            address: req.body.address,
            city: req.body.city,
            PSC: req.body.PSC,
            state: req.body.state,
            inf: req.body.inf,
            parentFirstName: req.body.parentFirstName,
            parentLastName: req.body.parentLastName,
            parentEmail: req.body.parentEmail,
            parentPhoneNum: req.body.parentPhoneNum,
            parentInf: req.body.parentInf,
            pickCourse: req.body.pickCourse
        })
    } else {
        const kurz = await Kurz.findOne({
                name: req.body.pickCourse
            })
            .then(kurz => {
                return kurz;
            })
            .catch(err => console.log(err));
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
            const lastDigits = String(PSC)
                .replace(/\s+/g, "")
                .slice(-2);
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

        const data = await ejs.renderFile(
            process.cwd() + "/views/emailTemplate.ejs", {
                user: req.body,
                PSC: convertPSC(req.body.PSC),
                phoneNum: convertPhoneNum(req.body.phoneNum),
                parentPhoneNum: convertPhoneNum(req.body.parentPhoneNum)
            }
        );

        const mailList = `${req.body.email}, ${req.body.parentEmail}`;

        let mailOptions = {
            from: "muvschool@gmail.com",
            to: mailList,
            subject: "MUVschool - Prihláška na kurz",
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

        res.render("services", {
            user: req.body,
            title: "Services"
        });
    }
});

module.exports = router;