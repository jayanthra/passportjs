const express = require('express');
const app = express();
const authRoutes = require('./routes/authroutes');
const profileRoutes = require('./routes/profileroutes');
const session = require('express-session')
const passport = require('passport');
const keys = require('./config/keys');
const mongoose = require('mongoose');

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: keys.session.key
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(keys.mongodb.dburi, {
    useNewUrlParser: true
}, () => {
    console.log('connected to mongodb');
});

const passportGoogle = require('./config/google');
const passportTwitter = require('./config/twitter');
const passportFacebook = require('./config/facebook');


app.set('view engine', 'ejs');

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.get('/', (req, res) => {
    res.render('home', {
        user: req.user
    });
})

app.listen(3000, () => {
    console.log('listening on port ');
})