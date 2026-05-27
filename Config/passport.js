const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const userModel = require("../models/user.model");

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          "https://bookshelf-backend-pahb.onrender.com/api/v1/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const newUser = {
            googleId: profile.id,
            username: profile.displayName,
            userImage: profile.photos?.[0]?.value,
            email: profile.emails?.[0]?.value,
          };

          let existingUser = await userModel.findOne({ googleId: profile.id }); //check if the user is already registered
          if (existingUser) return done(null, existingUser);

          const email = profile.emails?.[0]?.value;
          const sameEmail = await userModel.findOne({ email });
          if (sameEmail) {
            sameEmail.googleId = profile.id;
            await sameEmail.save();
            return done(null, sameEmail);
          }

          let createUser = await userModel.create(newUser);
          let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.NODE_EMAIL,
              pass: process.env.NODE_PASSWORD,
            },
          });

          let mailOptions = {
            from: process.env.NODE_EMAIL,
            to: newUser.email,
            subject: "Sending Email using Node.js",
            text: "That was easy!",
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
               }
          });
          return done(null, createUser);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userModel.findById(id);
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  });
};
