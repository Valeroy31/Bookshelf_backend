const mongoose = require("mongoose");
const reviewModel = require("../models/review.model");

exports.createReview = async (req, res)=>{
    try {
        const {title, body, rating, bookId, dateCreated} = req.body
        if(!title || !body || !rating){
            return res.status(400).json({message: "Please fill all fields"})
        }
        const newReview = await reviewModel.create({title, body, rating, bookId, dateCreated});
        console.log(req.body);
        
        res.status(201).json(newReview);
    } catch (error) {
        res.status(500).json({message: "Error creating review", error});
        console.log(error);
        
    }
}

exports.getReviews = async (req, res)=>{
    try {
        const reviews = await reviewModel.find({bookId: req.params.bookId});
        res.status(200).json(reviews);
        
    } catch (error) {
        res.status(500).json({message: "Error fetching reviews", error});
    }
}