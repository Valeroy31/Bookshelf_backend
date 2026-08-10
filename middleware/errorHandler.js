const {logEvents} = require('./logEvents')

const errorHandler = (err, req, res, next)=>{
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}`, 'errLog.txt');
    console.log(err.stack);

    //if the response already started, hand off to express' default handler
    if (res.headersSent) return next(err)

    const status = err.status || err.statusCode || 500
    res.status(status).json({message: err.message || 'Internal Server Error'})
}
module.exports = errorHandler