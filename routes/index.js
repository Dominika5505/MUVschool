const router = require('express').Router();
const {
    subscriberValidation
} = require('../validation');
const Subscriber = require('../models/Subscriber');

router.get('/', (req, res) => {
    res.render('index', {
        title: '• MUVschool •',
    })
});

router.get('/about', (req, res) => {
    res.render('about', {
        title: 'O Nás'
    })
});

router.get('/register', (req, res) => {
    res.render('partials/registerForm', {
        title: 'Prihlásenie na Kurz',
    });
});


router.get('/emailUser', (req, res) => {
    res.render('emailConfirm', {
        title: 'Email User',
        layout: 'emailLayout'
    })
})

router.get('/emailPayed', (req, res) => {
    res.render('emailPayed', {
        title: 'Email User',
        layout: 'emailLayout'
    })
})

router.get('/info', (req, res) => {
    res.render('info', {
        title: 'Info'
    })
})

router.get('/message', (req, res) => {
    res.render('emailMessage', {
        title: 'subscriber message',
        layout: 'emailLayout'
    })
})






module.exports = router;