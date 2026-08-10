const express = require("express");
//Access Token (short time) for authenication and for registration completion. Store in memory, not LS or 🍪

//Referesh token (long time) to ensure users can log in without a reauthentication. Sent as httpOnly cookie

const app = express();
const path = require('path')
const {logger} = require('./middleware/logEvents.js')
const errorHandler = require('./middleware/errorHandler.js')
const port = process.env.PORT || 5000;
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')
const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require('cookie-parser')
const passport = require("passport"); //for authentication
const session = require("express-session"); //for managing user sessions after authentication
const connect = require("./Config/db.js");
const corsOptions = require("./Config/corsOptions.js")
const verifyJWT = require('./middleware/verifyToken.js')
app.use(cors(corsOptions));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())



app.use(logger) //custom middleware for logging events

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, //don't save session if unmodified
    saveUninitialized: false, //don't create session until something stored
  }),
);
connect();
//passport middleware
app.use(passport.initialize()); //initialize passport for authentication
app.use(passport.session()); //persistent login sessions, passport will serialize and deserialize user instances to and from the session
//passport config for google auth
require('./Config/passport.js')(passport)



const userRoute = require("./routes/user.routes.js");
const reviewRoute = require("./routes/review.routes.js");
const adminRoute = require("./routes/admin.routes.js");
const googleAuthRoute = require("./routes/auth.routes.js");
app.use("/api/v1/admins", adminRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/reviews", verifyJWT, reviewRoute);
app.use("/api/v1", googleAuthRoute);


app.use(errorHandler) //custom middleware for handling errors - must stay last, after all routes


app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`server is active on ${port}`);
  }
});

       