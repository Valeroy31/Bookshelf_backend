const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const userModel = require('../models/user.model');

module.exports = function(passport){
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://www.example.com/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) =>{
        console.log(profile)
    }))

  passport.serializeUser((user, done)=>{
    done(null, user.id)
  })

  passport.deserializeUser(async (id, done)=>{
    try {
        const user = await userModel.findById(id)
       return done(null, user)
    } catch (error) {
       return done(error)
    }
  })

}

