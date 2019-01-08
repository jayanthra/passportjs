//http://www.passportjs.org/packages/passport-twitter/
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
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

var trustProxy = false;
if (process.env.DYNO) {
    // Apps on heroku are behind a trusted proxy
    trustProxy = true;
}

passport.use(new TwitterStrategy({
    consumerKey: keys.twitter.consumerKey,
    consumerSecret: keys.twitter.consumerSecret,
    callbackURL: '/auth/twitter/redirect',
    proxy: trustProxy
}, function (token, tokenSecret, profile, done) {
   
    User.findOne({twitterId: profile.id}).then((currentUser) => {
        if(currentUser){
            console.log('user exists: ', currentUser);
            done(null, currentUser);
        } else {
            new User({
                twitterId: profile.id,
                username: profile.displayName,
                profileImage : profile.photos[0].value,
                socialNetwork : 'twitter'
            }).save().then((newUser) => {
                console.log('new user created: ', newUser);
                done(null, newUser);
            });         
        }
    });
}));



// {
//     id: '486467531',
//     username: 'JayanthRAcharya',
//     displayName: 'Jayanth',
//     photos: [{
//         value: 'https://pbs.twimg.com/profile_images/757982578011889664/yRFqjfS3_normal.jpg'
//     }],
//     provider: 'twitter',
//     _raw: '{"id":486467531,"id_str":"486467531","name":"Jayanth","screen_name":"JayanthRAcharya","location":"India","description":"Front  End Developer @Robosoft","url":"https:\\/\\/t.co\\/Jz0TefNf12","entities":{"url":{"urls":[{"url":"https:\\/\\/t.co\\/Jz0TefNf12","expanded_url":"https:\\/\\/jayanthacharya.com","display_url":"jayanthacharya.com","indices":[0,23]}]},"description":{"urls":[]}},"protected":false,"followers_count":99,"friends_count":178,"listed_count":5,"created_at":"Wed Feb 08 09:59:23 +0000 2012","favourites_count":22,"utc_offset":null,"time_zone":null,"geo_enabled":false,"verified":false,"statuses_count":363,"lang":"en","status":{"created_at":"Thu Jan 03 05:09:04 +0000 2019","id":1080692499721596931,"id_str":"1080692499721596931","text":"RT @gwilylee: when another one bites the dust starts playing https:\\/\\/t.co\\/cxcfHkrQBB","truncated":false,"entities":{"hashtags":[],"symbols":[],"user_mentions":[{"screen_name":"gwilylee","name":"rafaela","id":1071937465978630145,"id_str":"1071937465978630145","indices":[3,12]}],"urls":[],"media":[{"id":1080246475517501440,"id_str":"1080246475517501440","indices":[61,84],"media_url":"http:\\/\\/pbs.twimg.com\\/ext_tw_video_thumb\\/1080246475517501440\\/pu\\/img\\/sb6M-9lfxEAUfvan.jpg","media_url_https":"https:\\/\\/pbs.twimg.com\\/ext_tw_video_thumb\\/1080246475517501440\\/pu\\/img\\/sb6M-9lfxEAUfvan.jpg","url":"https:\\/\\/t.co\\/cxcfHkrQBB","display_url":"pic.twitter.com\\/cxcfHkrQBB","expanded_url":"https:\\/\\/twitter.com\\/gwilylee\\/status\\/1080247108278603787\\/video\\/1","type":"photo","sizes":{"thumb":{"w":150,"h":150,"resize":"crop"},"large":{"w":640,"h":360,"resize":"fit"},"medium":{"w":640,"h":360,"resize":"fit"},"small":{"w":640,"h":360,"resize":"fit"}},"source_status_id":1080247108278603787,"source_status_id_str":"1080247108278603787","source_user_id":1071937465978630145,"source_user_id_str":"1071937465978630145"}]},"extended_entities":{"media":[{"id":1080246475517501440,"id_str":"1080246475517501440","indices":[61,84],"media_url":"http:\\/\\/pbs.twimg.com\\/ext_tw_video_thumb\\/1080246475517501440\\/pu\\/img\\/sb6M-9lfxEAUfvan.jpg","media_url_https":"https:\\/\\/pbs.twimg.com\\/ext_tw_video_thumb\\/1080246475517501440\\/pu\\/img\\/sb6M-9lfxEAUfvan.jpg","url":"https:\\/\\/t.co\\/cxcfHkrQBB","display_url":"pic.twitter.com\\/cxcfHkrQBB","expanded_url":"https:\\/\\/twitter.com\\/gwilylee\\/status\\/1080247108278603787\\/video\\/1","type":"video","sizes":{"thumb":{"w":150,"h":150,"resize":"crop"},"large":{"w":640,"h":360,"resize":"fit"},"medium":{"w":640,"h":360,"resize":"fit"},"small":{"w":640,"h":360,"resize":"fit"}},"source_status_id":1080247108278603787,"source_status_id_str":"1080247108278603787","source_user_id":1071937465978630145,"source_user_id_str":"1071937465978630145","video_info":{"aspect_ratio":[16,9],"duration_millis":44540,"variants":[{"bitrate":832000,"content_type":"video\\/mp4","url":"https:\\/\\/video.twimg.com\\/ext_tw_video\\/1080246475517501440\\/pu\\/vid\\/640x360\\/tPockQGuNVXbK29E.mp4?tag=6"},{"bitrate":256000,"content_type":"video\\/mp4","url":"https:\\/\\/video.twimg.com\\/ext_tw_video\\/1080246475517501440\\/pu\\/vid\\/320x180\\/u93oYtWPJF_xKfWv.mp4?tag=6"},{"content_type":"application\\/x-mpegURL","url":"https:\\/\\/video.twimg.com\\/ext_tw_video\\/1080246475517501440\\/pu\\/pl\\/dcYUOQ-S3ff_3bQt.m3u8?tag=6"}]},"additional_media_info":{"monetizable":false}}]},"source":"\\u003ca href=\\"http:\\/\\/twitter.com\\" rel=\\"nofollow\\"\\u003eTwitter Web Client\\u003c\\/a\\u003e","in_reply_to_status_id":null,"in_reply_to_status_id_str":null,"in_reply_to_user_id":null,"in_reply_to_user_id_str":null,"in_reply_to_screen_name":null,"geo":null,"coordinates":null,"place":null,"contributors":null,"retweeted_status":{"created_at":"Tue Jan 01 23:39:15 +0000 2019","id":1080247108278603787,"id_str":"1080247108278603787","text":"when another one bites the dust starts playing https:\\/\\/t.co\\/cxcfHkrQBB","truncated":false,"entities":{"hashtags":[],"symbols":[],"user_mentions":[],"urls":[],"media":[{"id":1080246475517501440,"id_str":"1080246475517501440","indices":[47,70],"media_url":"http:\\/\\/pbs.twimg.com\\/ext_tw_video_thumb\\/1080246475517501440\\/pu\\/img\\/sb6M-9lfxEAUfvan.jpg","media_url_https":"https:\\/\\/pbs.twimg.com\\/ext_tw_video_thumb\\/1080246475517501440\\/pu\\/img\\/sb6M-9lfxEAUfvan.jpg","url":"https:\\/\\/t.co\\/cxcfHkrQBB","display_url":"pic.twitter.com\\/cxcfHkrQBB","expanded_url":"https:\\/\\/twitter.com\\/gwilylee\\/status\\/1080247108278603787\\/video\\/1","type":"photo","sizes":{"thumb":{"w":150,"h":150,"resize":"crop"},"large":{"w":640,"h":360,"resize":"fit"},"medium":{"w":640,"h":360,"resize":"fit"},"small":{"w":640,"h":360,"resize":"fit"}}}]},"extended_entities":{"media":[{"id":1080246475517501440,"id_str":"1080246475517501440","indices":[47,70],"media_url":"http:\\/\\/pbs.twimg.com\\/ext_tw_video_thumb\\/1080246475517501440\\/pu\\/img\\/sb6M-9lfxEAUfvan.jpg","media_url_https":"https:\\/\\/pbs.twimg.com\\/ext_tw_video_thumb\\/1080246475517501440\\/pu\\/img\\/sb6M-9lfxEAUfvan.jpg","url":"https:\\/\\/t.co\\/cxcfHkrQBB","display_url":"pic.twitter.com\\/cxcfHkrQBB","expanded_url":"https:\\/\\/twitter.com\\/gwilylee\\/status\\/1080247108278603787\\/video\\/1","type":"video","sizes":{"thumb":{"w":150,"h":150,"resize":"crop"},"large":{"w":640,"h":360,"resize":"fit"},"medium":{"w":640,"h":360,"resize":"fit"},"small":{"w":640,"h":360,"resize":"fit"}},"video_info":{"aspect_ratio":[16,9],"duration_millis":44540,"variants":[{"bitrate":832000,"content_type":"video\\/mp4","url":"https:\\/\\/video.twimg.com\\/ext_tw_video\\/1080246475517501440\\/pu\\/vid\\/640x360\\/tPockQGuNVXbK29E.mp4?tag=6"},{"bitrate":256000,"content_type":"video\\/mp4","url":"https:\\/\\/video.twimg.com\\/ext_tw_video\\/1080246475517501440\\/pu\\/vid\\/320x180\\/u93oYtWPJF_xKfWv.mp4?tag=6"},{"content_type":"application\\/x-mpegURL","url":"https:\\/\\/video.twimg.com\\/ext_tw_video\\/1080246475517501440\\/pu\\/pl\\/dcYUOQ-S3ff_3bQt.m3u8?tag=6"}]},"additional_media_info":{"monetizable":false}}]},"source":"\\u003ca href=\\"http:\\/\\/twitter.com\\/download\\/android\\" rel=\\"nofollow\\"\\u003eTwitter for Android\\u003c\\/a\\u003e","in_reply_to_status_id":null,"in_reply_to_status_id_str":null,"in_reply_to_user_id":null,"in_reply_to_user_id_str":null,"in_reply_to_screen_name":null,"geo":null,"coordinates":null,"place":null,"contributors":null,"is_quote_status":false,"retweet_count":90167,"favorite_count":224531,"favorited":false,"retweeted":true,"possibly_sensitive":false,"lang":"en"},"is_quote_status":false,"retweet_count":90167,"favorite_count":0,"favorited":false,"retweeted":true,"possibly_sensitive":false,"lang":"en"},"contributors_enabled":false,"is_translator":false,"is_translation_enabled":false,"profile_background_color":"1A1B1F","profile_background_image_url":"http:\\/\\/abs.twimg.com\\/images\\/themes\\/theme9\\/bg.gif","profile_background_image_url_https":"https:\\/\\/abs.twimg.com\\/images\\/themes\\/theme9\\/bg.gif","profile_background_tile":false,"profile_image_url":"http:\\/\\/pbs.twimg.com\\/profile_images\\/757982578011889664\\/yRFqjfS3_normal.jpg","profile_image_url_https":"https:\\/\\/pbs.twimg.com\\/profile_images\\/757982578011889664\\/yRFqjfS3_normal.jpg","profile_banner_url":"https:\\/\\/pbs.twimg.com\\/profile_banners\\/486467531\\/1437885723","profile_link_color":"1B95E0","profile_sidebar_border_color":"181A1E","profile_sidebar_fill_color":"252429","profile_text_color":"666666","profile_use_background_image":true,"has_extended_profile":true,"default_profile":false,"default_profile_image":false,"following":false,"follow_request_sent":false,"notifications":false,"translator_type":"none","suspended":false,"needs_phone_verification":false}',
//     _json: {
//         id: 486467531,
//         id_str: '486467531',
//         name: 'Jayanth',
//         screen_name: 'JayanthRAcharya',
//         location: 'India',
//         description: 'Front  End Developer @Robosoft',
//         url: 'https://t.co/Jz0TefNf12',
//         entities: {
//             url: [Object],
//             description: [Object]
//         },
//         protected: false,
//         followers_count: 99,
//         friends_count: 178,
//         listed_count: 5,
//         created_at: 'Wed Feb 08 09:59:23 +0000 2012',
//         favourites_count: 22,
//         utc_offset: null,
//         time_zone: null,
//         geo_enabled: false,
//         verified: false,
//         statuses_count: 363,
//         lang: 'en',
//         status: {
//             created_at: 'Thu Jan 03 05:09:04 +0000 2019',
//             id: 1080692499721596900,
//             id_str: '1080692499721596931',
//             text: 'RT @gwilylee: when another one bites the dust starts playing https://t.co/cxcfHkrQBB',
//             truncated: false,
//             entities: [Object],
//             extended_entities: [Object],
//             source: '<a href="http://twitter.com" rel="nofollow">Twitter Web Client</a>',
//             in_reply_to_status_id: null,
//             in_reply_to_status_id_str: null,
//             in_reply_to_user_id: null,
//             in_reply_to_user_id_str: null,
//             in_reply_to_screen_name: null,
//             geo: null,
//             coordinates: null,
//             place: null,
//             contributors: null,
//             retweeted_status: [Object],
//             is_quote_status: false,
//             retweet_count: 90167,
//             favorite_count: 0,
//             favorited: false,
//             retweeted: true,
//             possibly_sensitive: false,
//             lang: 'en'
//         },
//         contributors_enabled: false,
//         is_translator: false,
//         is_translation_enabled: false,
//         profile_background_color: '1A1B1F',
//         profile_background_image_url: 'http://abs.twimg.com/images/themes/theme9/bg.gif',
//         profile_background_image_url_https: 'https://abs.twimg.com/images/themes/theme9/bg.gif',
//         profile_background_tile: false,
//         profile_image_url: 'http://pbs.twimg.com/profile_images/757982578011889664/yRFqjfS3_normal.jpg',
//         profile_image_url_https: 'https://pbs.twimg.com/profile_images/757982578011889664/yRFqjfS3_normal.jpg',
//         profile_banner_url: 'https://pbs.twimg.com/profile_banners/486467531/1437885723',
//         profile_link_color: '1B95E0',
//         profile_sidebar_border_color: '181A1E',
//         profile_sidebar_fill_color: '252429',
//         profile_text_color: '666666',
//         profile_use_background_image: true,
//         has_extended_profile: true,
//         default_profile: false,
//         default_profile_image: false,
//         following: false,
//         follow_request_sent: false,
//         notifications: false,
//         translator_type: 'none',
//         suspended: false,
//         needs_phone_verification: false
//     },
//     _accessLevel: 'read-write'
// }