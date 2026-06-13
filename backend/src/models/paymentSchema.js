const mongoose=require("mongoose");

const paymentSchema=new mongoose.Schema({
    userID:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true,
    },
    orderID:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true,
    },
    currency:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
    },
    reciept:{
        type:String,
        required:true,
    },
    paymentID:{
        type:String,
    },
    notes:{
        firstName:{
            type:String,
        },
        lastName:{
            type:String,
        },
        membershipType:{
            type:String,
        },
    },

},

{timestamps:true}
);

module.exports=mongoose.model("Payment",paymentSchema);