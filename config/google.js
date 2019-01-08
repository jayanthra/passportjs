//https://github.com/jaredhanson/passport-google-oauth2
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const User = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy({
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {     
      
         User.findOne({googleId: profile.id}).then((currentUser) => {
            if(currentUser){
                console.log('user exists: ', currentUser);
                done(null, currentUser);
            } else {
                new User({
                    googleId: profile.id,
                    username: profile.displayName,
                    profileImage : profile.photos[0].value,
                    socialNetwork : 'google'
                }).save().then((newUser) => {
                    console.log('new user created: ', newUser);
                    done(null, newUser);
                });        
            }
        });
    })
);

// {
//     id: '116108331814973312369',
//     displayName: 'Jayanth',
//     name: {
//         familyName: '',
//         givenName: 'Jayanth'
//     },
//     photos: [{
//         value: 'https://lh4.googleusercontent.com/-W9Cq50NG-Oc/AAAAAAAAAAI/AAAAAAAAAB4/unHoX_VKvPA/photo.jpg?sz=50'
//     }],
//     gender: undefined,
//     provider: 'google',
//     _raw: '{\n "kind": "plus#person",\n "etag": "\\"jb1Xzanox6i8Zyse4DcYD8sZqy0/xwGZ6pB062Ok7lXsgtKSNHbzovk\\"",\n "nickname": "Jay",\n "objectType": "person",\n "id": "116108331814973312369",\n "displayName": "Jayanth",\n "name": {\n  "familyName": "",\n  "givenName": "Jayanth"\n },\n "url": "https://plus.google.com/116108331814973312369",\n "image": {\n  "url": "https://lh4.googleusercontent.com/-W9Cq50NG-Oc/AAAAAAAAAAI/AAAAAAAAAB4/unHoX_VKvPA/photo.jpg?sz=50",\n  "isDefault": false\n },\n "isPlusUser": true,\n "language": "en",\n "circledByCount": 0,\n "verified": false,\n "cover": {\n  "layout": "banner",\n  "coverPhoto": {\n   "url": "https://lh3.googleusercontent.com/ZpPbvZHOR_qVIdYF6nirkoHK7HaRNdk_WSIXrZzZogR_5hZK8C-PXxxKL4ZQOWeXEcHCUM8fUgc=s630-fcrop64=1,00000000ffffffff",\n   "height": 528,\n   "width": 940\n  },\n  "coverInfo": {\n   "topImageOffset": 0,\n   "leftImageOffset": 0\n  }\n }\n}\n',
//     _json: {
//         kind: 'plus#person',
//         etag: '"jb1Xzanox6i8Zyse4DcYD8sZqy0/xwGZ6pB062Ok7lXsgtKSNHbzovk"',
//         nickname: 'Jay',
//         objectType: 'person',
//         id: '116108331814973312369',
//         displayName: 'Jayanth',
//         name: {
//             familyName: '',
//             givenName: 'Jayanth'
//         },
//         url: 'https://plus.google.com/116108331814973312369',
//         image: {
//             url: 'https://lh4.googleusercontent.com/-W9Cq50NG-Oc/AAAAAAAAAAI/AAAAAAAAAB4/unHoX_VKvPA/photo.jpg?sz=50',
//             isDefault: false
//         },
//         isPlusUser: true,
//         language: 'en',
//         circledByCount: 0,
//         verified: false,
//         cover: {
//             layout: 'banner',
//             coverPhoto: [Object],
//             coverInfo: [Object]
//         }
//     }
// }