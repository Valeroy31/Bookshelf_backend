const mongoose = require("mongoose");
const reviewModel = require("../models/review.model");

const createReview = async (req, res, next)=>{
    try {
        const {title, body, rating, bookId, dateCreated} = req.body
        if(!title || !body || !rating){
            return res.status(400).json({message: "Please fill all fields"})
        }
        const newReview = await reviewModel.create({title, body, rating, bookId, dateCreated});
        console.log(req.body);

        res.status(201).json(newReview);
    } catch (error) {
        next(error);
    }
}

const getReviews = async (req, res, next)=>{
    try {
        const reviews = await reviewModel.find({bookId: req.params.bookId});
        res.status(200).json(reviews);

    } catch (error) {
        next(error);
    }
}

module.exports = {createReview, getReviews}