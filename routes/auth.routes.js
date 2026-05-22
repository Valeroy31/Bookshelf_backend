const mongoose = require('mongoose');
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oidc');
const router = express.Router();
const userModel = require('../models/user.model')
const {createUser, getUsers} = require('../controller/user.controller')

router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }))

router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/login'}))

module.exports = router