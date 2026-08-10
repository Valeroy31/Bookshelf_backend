const mongoose = require("mongoose");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res, next) => {
    const cookies = req.cookies
      if(!cookies?.jwt) return res.sendStatus(403)
  
try {
       const refreshToken = cookies.jwt;
               const existingUser = await userModel.findOne({refreshToken})
    if(!existingUser) return res.sendStatus(403)
        jwt.verify(
       refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
         (err, decoded)=>{
            if (err || existingUser.username != decoded.sub) return res.sendStatus(403)
                const accessToken = jwt.sign(
        { sub: existingUser.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10m" },
      );
      const {sub} = decoded
      res.json({sub, accessToken})
         }
    
    )
} catch (error) {
    next(error)
}
}

    module.exports = handleRefreshToken

