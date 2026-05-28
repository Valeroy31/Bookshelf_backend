const mongoose = require("mongoose");
const userModel = require("../models/user.model");
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");
const bcrypt = require('bcryptjs')
const createUser = async(req, res) => {

    try {
      
    const { username, email, password, dateCreated, lastVisited } = req.body;
    const salt = await bcrypt.genSalt(12)
    const hash = await bcrypt.hash(password, salt)
      const user = await userModel.create({ username, email, password: hash, dateCreated, lastVisited });
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
      if (error.code === 11000) {
        return res
          .status(400)
          .json({ message: "username or email already exists" });
      }
      res.status(500).json({ message: 'Cannot create User at this time', error: error.message });
     
    }
  };

  const getUsers =async(req, res)=>{
    try {
  const allUsers =  await userModel.find()
    res.send({status: true, allUsers})
    } catch (error) {
        res.send({status: false, message: 'could not get users', error: error.message})
    }
    

  }
const loginUser = async(req,res)=>{

  try {
    const {username, password} = req.body
 const checkUsername = await userModel.findOne({username})
 if (!checkUsername)   return res.status(400).json('Account not found. Please signup')
 
  const isValid = await bcrypt.compare(password, checkUsername.password)
  if (isValid)  {
   const token = jwt.sign({sub: checkUsername._id, username: checkUsername.username}, process.env.JWT_SECRET, {expiresIn: '7d'})
    return res.status(200).json({ message: 'Login successful', token })

  }else{
    return res.status(400).json('Invalid credentials')
  }
  } catch (error) {
    return res.status(500).json(error.message)
  }
 
  
  
 


 

}
module.exports = { createUser, getUsers, loginUser };
