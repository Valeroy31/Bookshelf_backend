const express = require('express');
const app = express();
const port = process.env.PORT || 5000
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors())

const userRoute = require('./routes/user.routes.js')
const adminRoute = require('./routes/admin.routes.js')

app.use('/api/v1/admins', adminRoute)
app.use('/api/v1/users', userRoute)

 const URI = process.env.DATABASE_URI

const connect = async()=>{
    try {
        const connected = await mongoose.connect(URI)
        if(connected){
            console.log('connected to database successfully');   
        }
    } catch (error) {
        console.log('could not connect to database', error);
        
    }
}
connect()

app.listen(port,(err)=>{
 if(err){
    console.log(err);
    
 }else{
    console.log(`server is active on ${port}`);
    
 }
})