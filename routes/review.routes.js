const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const reviewModel = require('../models/review.model')
const {createReview, getReviews} = require('../controller/review.controller')

router.post('/create_review', createReview)
router.get('/get_reviews', getReviews)

module.exports = router