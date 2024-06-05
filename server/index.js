

const express=require('express');
const app=express();
const mongoose=require('mongoose');
const dotenv=require('dotenv').config();
const cors=require('cors');

const authRoutes= require('./routes/auth.js');
const listingRoutes =require('./routes/listing.js');
const bookingRoutes = require("./routes/booking.js");

const userRoutes = require("./routes/user.js")

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// routes 
app.use("/auth", authRoutes);
app.use("/properties",listingRoutes);
app.use("/bookings", bookingRoutes);
app.use("/users", userRoutes)


const PORT= 3000;

// mongoose setup 
mongoose.connect(process.env.MONGO_URL,{
    dbName:"project12",
 
}).then(()=>{
    app.listen(PORT,()=>console.log(`Yesss server is currently  connected to port ${PORT}`))

}).catch((err)=>console.log(`${err} server not connected `));


