const express = require('express');
const app = express();
const mongoose = require('mongoose')
const URI = process.env.DATABASE_URI
const connect = async()=>{
    try {
        const connected = await mongoose.connect(URI)
        if(connected){
            console.log(` ${connected.connection.host}:${connected.connection.port}/bookshelf_api database connected successfully`);   
        }
    } catch (error) {
        console.log(`could not connect to database`, error);
        process.exit(1)
        
    }
}


module.exports = connect
