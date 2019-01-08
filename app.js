const express = require('express');
const app = express();
const authRoutes = require('./routes/authroutes')
const session = require('express-session')
const passport = require('passport');


app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'bla bla bla' 
}));

app.use(passport.initialize());
app.use(passport.session());

const passportGoogle = require('./config/google')
const passportTwitter = require('./config/twitter')


app.set('view engine','ejs');

app.use('/auth', authRoutes);

app.get('/',(req,res)=>{
    res.render('home');
})

app.listen(3000,()=>{
    console.log('listening on port ');
})