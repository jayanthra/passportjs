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

router.get('/google/redirect',passport.authenticate('google'), (req, res) => {
    res.send(req.user);
});



router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/redirect',
    passport.authenticate('twitter', {
        failureRedirect: '/login'
    }),
    function (req, res) {
        res.send(req.user);
    });



router.get('/facebook', (req, res) => {
    res.send('logging in with facebook');
});


module.exports = router;