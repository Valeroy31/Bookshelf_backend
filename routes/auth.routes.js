const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken')
const passport = require('passport');
const session = require('express-session')
const router = express.Router();
const userModel = require('../models/user.model')
const {createUser, getUsers} = require('../controller/user.controller')

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/login'}), 
  (req, res)=>{
  const token =  jwt.sign({sub: req.user._id, username: req.user.username}, process.env.JWT_SECRET, {expiresIn: '7d'})
    
     res.redirect(`http://localhost:5173/auth/callback?token=${token}`)
  }

)
router.post('/logout', (req, res)=>{
  req.logout( err =>{
if (err)  return next(err)
  req.session.destroy( err=>{
if (err) return next(err)})
  res.status(200).json('logout successful')
  }
    
  )
})


module.exports = router


