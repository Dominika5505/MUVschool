const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('index', {
        title: '• MUVschool •'
    })
});

router.get('/about', (req, res) => {
    res.render('about', {
        title: 'O Nás'
    })
});

router.get('/services', (req, res) => {
    res.render('services', {
        title: 'Tréningy'
    })
});

router.get('/contact', (req, res) => {
    res.render('contact', {
        title: 'Kontakt'
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





module.exports = router;