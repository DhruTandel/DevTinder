const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
       ref:"User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["accepted", "rejected", "ignored","interested"],
        message: `{VALUE} is incorrect type`,
      },
    },
  },
  {
    timestamps: true,
  },
);

connectionRequestSchema.index({
  fromUserId:1,
  toUserId:1
})

const ConnectRequestModel=new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
)


module.exports=ConnectRequestModel;