const mongoose = require("mongoose");
const userModel = require("../models/user.model");
const nodemailer = require("nodemailer");
const { AiFillCustomerService } = require("react-icons/ai");
const createUser = async(req, res) => {
    const { username, email, password } = req.body;

    try {
      const user = await userModel.create({ username, email, password });
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
          res
            .status(201)
            .json({ message: "Email sent successfully" }, info.response);
        }
      });
      res.status(201).json({ message: "user created successfully", user });
    } catch (error) {
      if (error.code === 11000) {
        return res
          .status(400)
          .json({ message: "username or email already exists" });
      }
      res.status(500).json({ message: "could not create user", error: error.message });
     
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

module.exports = { createUser, getUsers };
