const express = require('express');
var passport = require('passport');
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const { jwtStrategy } = require('./config/passport');
const session = require('express-session');
const { processGoogleAuth,  } = require('./modules/auth/auth.controller');

const router = express.Router();

const remote_backend_url = process.env.REMOTE_BACKEND_API_URL;
const remote_web_url = process.env.REMOTE_BASE_URL;

const API_URL = remote_backend_url; 
const WEB_URL = remote_web_url; 

passport.use('jwt', jwtStrategy);

router.use(session({
    secret: "secretg",
    resave: false,
    saveUninitialized: true,

}))

router.use(passport.initialize());
router.use(passport.session())

const authUser = async (request, accessToken, refreshToken, profile, done) => {
    console.log("from authUser", profile)
    const response = await processGoogleAuth(profile)
    let rt = response?.socialLink ?? '';
    // res.redirect(`${WEB_URL}/login?callbackUrl=${rt}`);
    return done(null, rt);
}

passport.use('google1', new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    callbackURL: `${API_URL}/web/auth/google/callback`,
    passReqToCallback: true
}, authUser));

router.get('/auth/google',
    passport.authenticate("google1", {
        scope:
            ["email", "profile"]
    }
    ));

router.get('/auth/google/callback',
    passport.authenticate('google1', {
        failureRedirect: `${WEB_URL}/login`,
        session: false,
    }),
    (req, res) => {
        console.log(req.user, "from me in callback")
        res.redirect(`${WEB_URL}/login?callbackUrl=${req.user}`);
    }
);

module.exports = router;