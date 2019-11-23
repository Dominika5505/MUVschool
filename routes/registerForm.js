const router = require("express").Router();
const Kurz = require("../models/Kurz");
const {
    userValidation
} = require("../validation");
const fs = require("fs");
const ejs = require("ejs");
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: process.env.ACCESS_TOKEN,
    },
});

router.post("/", async (req, res) => {

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
    } = userValidation(req.body);



    // ----------------
    if (error) {
        const errorMsg = error.details[0].message;
        console.log(errorMsg.slice(-40));

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
        if (errorMsg.slice(-91) == 'fails to match the required pattern: /^(?:[A-zÀ-ú]+)(?:[A-Za-z0-9\\u0100-\\u017F áéíýóúô]*)$/') {
            errors.push({
                msg: 'Adresa môže obsahovať len písmená, číslice a medzeru.'
            })
        }
        if (errorMsg.slice(-49) == `fails to match the required pattern: /^[0-9\\s]*$/`) {
            errors.push({
                msg: 'PSČ nie je správna.'
            })
        }

        if (errorMsg.slice(-79) == 'match the required pattern: /^(?:[A-zÀ-ú]+)(?:[A-Za-z\\u0100-\\u017F áéíýóúô]*)$/') {
            errors.push({
                msg: 'Mesto nie je správne.'
            })
        }

        if (errorMsg.slice(-92) == 'match the required pattern: /^(?:[A-zÀ-ú]+)(?:[A-Za-z0-9\\u0100-\\u017F .,:?!áéíýóúô]*)$/') {
            errors.push({
                msg: 'Informácie musia obsahobať len čísla písmená . , : ? a !.'
            })
        }

        if (errorMsg.slice(-41) == 'length must be at least 2 characters long' || errorMsg.slice(-40) == 'less than or equal to 50 characters long' || errorMsg.slice(-78) == 'match the required pattern: /^(?:[A-zÀ-ú]+)(?:[A-Za-z\\u0100-\\u017Fáéíýóúô]*)$/') {
            errors.push({
                msg: 'Meno musí obsahovať len písmená v počte od 2 do 50.'
            })
        }

        if (error) {
            errors.push({
                msg: error.details[0].message
            });
        }

        if (errorMsg.slice(-26) == 'is not allowed to be empty' || req.body.pickCourse !== "Level 1" || req.body.pickCourse !== "Level 1" || errorMsg == '"dobDay" must be a valid date') {
            errors.push({
                msg: 'Všetky polia označené * musia byť vyplnené alebo zaškrtnuté.'
            })
        }


        // ----------------


        if (errorMsg == '"checkbox" is required' || errorMsg == '"checkboxGDPR" is required') {
            errors.push({
                msg: "Musíš súhlasiť s obchodnými podmienkami a so spracovaním osobných údajov!"
            });
        }
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
            })
        };

        if (usersPayedCountLevel1 > 5) {
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
        }

        if (usersPayedCountLevel2 > 18) {
            errors.push({
                msg: "Kurz je už plný!"
            });
        }
    }

    if (errors.length > 0 && req.body.pickCourse == 'Level 1') {
        console.log(errors);
        res.render('services', {
            level1: errors,
            title: 'Tréningy',
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dob: req.body.dob,
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
    } else if (errors.length > 0 && req.body.pickCourse == 'Level 2') {
        console.log(errors);
        res.render('services', {
            level2: errors,
            title: 'Tréningy',
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dob: req.body.dob,
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

        const convertDOB = dob => {
            dob = dob.split('-');
            return `${dob[2]}.${dob[1]}.${dob[0]}`;
        }

        console.log(typeof req.body.dob);

        kurz.users.push({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dob: convertDOB(req.body.dob),
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
                parentPhoneNum: convertPhoneNum(req.body.parentPhoneNum),
                dob: convertDOB(req.body.dob)
            }
        );

        const mailList = `${req.body.email}, ${req.body.parentEmail}`;

        let mailOptions = {
            from: "MUVschool <muvschool@gmail.com>",
            to: mailList,
            subject: "MUVschool - Prihláška na kurz",
            attachments: [{
                    filename: "LOGOBlack.png",
                    path: "./public/images/LOGOBlack.png",
                    cid: "logoBlack"
                },
                {
                    filename: "mailBgrImg-desat-light.jpg",
                    path: "./public/images/mailBgrImg-desat-light.jpg",
                    cid: "desat-light"
                },
                // {
                //     filename: "mailBgrImg-darken-blured.jpg",
                //     path: "./public/images/mailBgrImg-darken-blured.jpg",
                //     cid: "darken-blured"
                // }
            ],
            html: data
        };

        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                console.log("Error Occurs: ", err);
            } else {
                console.log("Email sent!!!");
            }
        });

        const isGmail = (mail) => {
            mail = mail.split('@');
            return (mail[1] == 'gmail.com') ? true : false;

        }

        res.render("services", {
            user: req.body,
            title: "Services",
            isGmail: isGmail(req.body.email)
        });
    }
});

module.exports = router;