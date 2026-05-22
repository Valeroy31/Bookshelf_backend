const mongoose = require('mongoose');
const GoogleOidcStrategy = require('passport-google-oidc');
const userSchema = new mongoose.Schema({
    googleId:{
        type: String,
        unique: true,
        required: true
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
        required: true,
        trim: true,
        minLength: 6,
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