const router = require('express').Router();
const passport = require('passport');

router.get('/login', (req, res) => {
    res.render('login', {
        user: req.user
    });
});

router.get('/logout', (req, res) => {
     req.logout();
     res.redirect('/');
});

router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.redirect('/profile');
});

router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/redirect',
    passport.authenticate('twitter', {
        failureRedirect: '/login'
    }),
    function (req, res) {
        res.redirect('/profile');
    });



router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/redirect',
    passport.authenticate('facebook', {
        failureRedirect: '/login'
    }),
    function (req, res) {
        res.redirect('/profile');
    });

module.exports = router;