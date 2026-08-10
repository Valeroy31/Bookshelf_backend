const whitelist = [
  "https://bookshelf-eight-liard.vercel.app/",
  "bookshelf-eight-liard.vercel.app/",
  "http://localhost:5173",
  "https://bookshelf-eight-liard.vercel.app",
  "http://localhost:5173",
  "https://bookshelf-eight-liard.vercel.app/api/v1",
  "http://localhost:5173/api/v1",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true ,
  optionSuccessStatus: 200,
};
module.exports = corsOptions;
  