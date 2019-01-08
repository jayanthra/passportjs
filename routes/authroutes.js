const router = require('express').Router();
const passport = require('passport');

router.get('/login', (req, res) => {
    res.render('login', {
        user: req.user
    });
});

router.get('/logout', (req, res) => {
    res.send('logging out');
});

router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

router.get('/google/redirect', (req, res) => {
    res.send('logged in via google');
});



router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/redirect',
    passport.authenticate('twitter', {
        failureRedirect: '/login'
    }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.send('logged in via twitter');
    });



router.get('/facebook', (req, res) => {
    res.send('logging in with facebook');
});


module.exports = router;