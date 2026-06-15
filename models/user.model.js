const mongoose = require('mongoose');
const GoogleOidcStrategy = require('passport-google-oidc');
const userSchema = new mongoose.Schema({
    googleId:{
        type: String,
        unique: true,
        sparse: true //ignore db documents that do not have it
    },
      firstName:{
        type: String,
        trim: true,
        sparse: true //ignore db documents that do not have it
    },
      lastName:{
        type: String,
        trim: true,
        sparse: true //ignore db documents that do not have it
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,

    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim:true,
    },
    password:{
        type: String,
        trim: true,
        minLength: 6,
        required: function () {
            return !this.googleId //required only if google id is absent
        }
    },
    userImage:{
        type: String
    },
    dateCreated:{
        type: Date,
        default: Date.now()
    },
      lastVisited: {
        type: Date,
        default: new Date()
    },
    
})

const userModel = mongoose.model('User', userSchema)
module.exports = userModel