const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const userModel = require('../models/user.model')
const {createUser} = require('../controller/user.controller')

router.post('/sign_up', createUser )

module.exports = router