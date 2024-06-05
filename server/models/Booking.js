

const mongoose= require('mongoose');

const BookingSchema= new mongoose.Schema( 

    {
        customerId: {type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        },
        hostId:{
            type: mongoose.Schema.Types.ObjectId,
         ref: "User",

        },
        listingId:{
            type: mongoose.Schema.Types.ObjectId,
         ref: "Listing",

        },
        startDate:{
            type:String,
            require:true,
        },
        endDate:{
            type:String,
            required:true,
        },
        totalPrice:{
            type:Number,
            required:true,
        },

    },
     { timestamps: true }
)

const Booking= mongoose.model("booking", BookingSchema );
module.exports= Booking