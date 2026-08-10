const mongoose = require("mongoose");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

const createUser = async (req, res, next) => {
  const { username, email, password, dateCreated, lastVisited } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    //check for duplicate user
    const duplicate = await userModel.findOne({ username });
    if (duplicate) {
      return res
        .status(409)
        .json({ message: "Username already exists. Try another" });
    }
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);
    const user = await userModel.create({
      username,
      email,
      password: hash,
      dateCreated,
      lastVisited,
    });
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODE_EMAIL,
        pass: process.env.NODE_PASSWORD,
      },
    });

    let mailOptions = {
      from: process.env.NODE_EMAIL,
      to: email,
      subject: "Sending Email using Node.js",
      text: "That was easy!",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    res.status(201).json({ message: "user created successfully", user });
  } catch (error) {
    //duplicate key - keep the 400 semantics, but let the handler send it
    if (error.code === 11000) {
      error.status = 400;
      error.message = "username or email already exists";
    }
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const allUsers = await userModel.find();
    res.send({ status: true, allUsers });
  } catch (error) {
    next(error);
  }
};


module.exports = { createUser, getUsers };
