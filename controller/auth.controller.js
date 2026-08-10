const mongoose = require("mongoose");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const foundUser = await userModel.findOne({ username });
    if (!foundUser)
      return res.status(400).json("Account not found. Please signup");

    const isValid = await bcrypt.compare(password, foundUser.password);
    if (isValid) {
      const accessToken = jwt.sign(
        { sub: foundUser.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10m" },
      );
       const refreshToken = jwt.sign(
        { sub: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" },
      );

      //save refresh to DB
      foundUser.refreshToken = refreshToken
      await foundUser.save()
      // await userModel.updateOne({username: foundUser.username}, {refreshToken} )

      //save refresh token as httpOnly cookie and pass access token as json to the frontend
      res.cookie( 'jwt', refreshToken, {httpOnly: true,secure: true, sameSite: 'None', maxAge: 7 * 24 * 60 * 60 * 1000})
     const sub = foundUser.username
      return res.status(200).json({ sub, accessToken });
    } else {
      return res.status(400).json("Invalid credentials");
    }
  } catch (error) {
    return next(error);
  }
};

const getDashboard = async (req, res, next) => {
 try {
    const user = await userModel.findOne(req.user);
      const { email, username } = user;
      return res.status(200).json({ status: true, email, username });
 } catch (error) {
    return next(error);
 }

};

module.exports = {loginUser, getDashboard}