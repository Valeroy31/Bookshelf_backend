const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
    rating:{
        type: Number, required: true
    },
    title: {
        type: String, required: true, trim: true
    },
    body:{
        type: String, required: true, trim: true
    },
    bookId: {
        type: String, required: true, trim:true
    },
    date: {
        type: Date, default: Date.now
    }

})
const reviewModel = mongoose.model('Review', reviewSchema )
module.exports = reviewModel