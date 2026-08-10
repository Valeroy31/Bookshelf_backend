const mongoose = require("mongoose");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

const handleLogout = async (req, res, next) => {
  //delete accessToken on frontend
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;
  try {
    const existingUser = await userModel.findOne({ refreshToken });
    if (!existingUser) {
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });
      return res.sendStatus(204);
    }
    //Delete refreshToken in DB
    existingUser.refreshToken = '';
    const result = await existingUser.save()
    // const deleteToken = await userModel.updateOne(
    //   { refreshToken },
    //   { refreshToken: "" },
    // );
    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" });
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

module.exports = handleLogout;
