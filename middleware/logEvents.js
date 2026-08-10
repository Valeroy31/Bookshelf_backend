const {format} = require('date-fns')
const {v4: uuid} = require('uuid')


const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')


const logEvents = async(message, logName)=>{
    const date = format(new Date(), 'yyyy-MM-dd\tHH:mm:ss')
    const loggedItem = `${date}\t${uuid()}\t${message}\n`
    console.log(loggedItem);

    try {
        if (!fs.existsSync(path.join(__dirname,'..', 'logs'))){
          await  fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }
        await fsPromises.appendFile(path.join(__dirname,'..',  'logs', logName), loggedItem)
    } catch (error) {
        console.log(error);
        
    }
    }
const logger = (req,res, next)=>{
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.txt')
  next()
}
    module.exports = {logEvents, logger}