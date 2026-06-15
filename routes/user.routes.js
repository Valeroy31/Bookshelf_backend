const mongoose = require('mongoose');
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oidc');
const router = express.Router();
const userModel = require('../models/user.model')
const {createUser, getUsers, loginUser, getDashboard} = require('../controller/user.controller')

// user auth routes
router.post('/sign_up', createUser )
router.get('/sign_up', getUsers)
router.post('/login', loginUser)
router.get('/dashboard', getDashboard)



module.exports = router