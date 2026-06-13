const express = require("express");
const userAuth = require("../middlewares/auth");
const razorpayInstance = require("../../utils/razorpay");
const Payment = require("../models/paymentSchema");
const { membershipAmount } = require("../../utils/constants");
const crypto = require("crypto");
const User = require("../models/User");

const paymentRouter = express.Router();

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  const { membershipType } = req.body;
  const { firstName, lastName, emailId } = req.user;

  try {
    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[membershipType] * 100,
      currency: "INR",
      receipt: "reciept#1",
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType: membershipType,
      },
    });

    console.log(order);

    const payment = new Payment({
      userID: req.user._id,
      orderID: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      reciept: order.receipt,
      notes: order.notes,
    });
    const savedPayment = await payment.save();
    res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.log(err);
  }
});

paymentRouter.post("/payment/verify", userAuth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    const isVerified = generatedSignature === razorpay_signature;
    if (!isVerified) {
      return res.status(400).json({ message: "Payment verification Failed" });
    }
    const payment = await Payment.findOne({
      orderID: razorpay_order_id,
    });
    if (!payment) {
      return res.status(404).json({
        message: "Payment record not found",
      });
    }
    payment.status="completed";
    payment.paymentID=razorpay_payment_id;
    await payment.save();

    await User.findByIdAndUpdate(
      req.user._id,
      {
        isPremium:true,
        membershipType:payment.notes.membershipType,
      }
    )

    res.json({
      message: "Payment verified successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = paymentRouter;
