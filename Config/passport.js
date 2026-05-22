const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const userModel = require('../models/user.model');

module.exports = function(passport){
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "https://bookshelf-backend-pahb.onrender.com/api/v1/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) =>{
        const newUser = {
            googleId: profile.id,
            username: profile.displayName,
            userImage: profile.photos[0].value
        }

        try {
            let user = await userModel.findOne({googleId: profile.id}) //check if the user is already registered
            if(user){
                return done(null, user)
            }else{
 let user = userModel.create(newUser)
          return  done(null, user)
            }
           
        } catch (error) {
            return done(error)
            console.log(error);
        }
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

