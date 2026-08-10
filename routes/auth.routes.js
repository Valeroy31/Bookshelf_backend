const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken')
const passport = require('passport');
const session = require('express-session')
const router = express.Router();
const userModel = require('../models/user.model')
const { loginUser, getDashboard } = require('../controller/auth.controller')
const handleRefreshToken = require('../controller/refreshToken.controller')
const verifyJWT = require('../middleware/verifyToken')
const handleLogout = require('../controller/logout.controller')
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
 async (req, res) => {
      const accessToken = jwt.sign(
        { sub: req.user.username },
        process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '10m' })
          
      const refreshToken = jwt.sign(
        { sub: req.user.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" },
      )
      req.user.refreshToken = refreshToken
      await req.user.save()
       res.cookie( 'jwt', refreshToken, {httpOnly: true,secure: true, sameSite: 'None', maxAge: 7 * 24 * 60 * 60 * 1000})
    console.log(req.user);
    res.redirect(`http://localhost:5173/auth/callback?state=${accessToken}&sub=${req.user.username}`)
  }
)
router.post('/login', loginUser)
router.get('/refresh', handleRefreshToken)
router.get('/dashboard', verifyJWT, getDashboard)
router.get('/logout', handleLogout)



module.exports = router


