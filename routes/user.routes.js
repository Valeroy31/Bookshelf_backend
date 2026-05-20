const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const userModel = require('../models/user.model')
const {createUser, getUsers} = require('../controller/user.controller')

router.post('/sign_up', createUser )
router.get('/sign_up', getUsers)

module.exports = router