const cron = require("node-cron");
const ConnectRequestModel = require("../models/connectionRequest");
const { subDays } = require("date-fns");
const sendEmail = require("../../utils/sendEmail");

cron.schedule("1 8 14 6 0", async () => {
  try {
    console.log("Cron is running...");

    const yesterday = subDays(new Date(), 1);

    const pendingRequests = await ConnectRequestModel.find({
      status: "interested",
      reminderSent: false,
      createdAt: {
        $lt: yesterday,
      },
    })
      .populate("fromUserId", "firstName emailID")
      .populate("toUserId", "firstName emailID");


    console.log("Pending Requests:", pendingRequests.length);

    for (const request of pendingRequests) {
      console.log("Sending email for request:", request._id);
      await sendEmail(
        "fallandrise2026@gmail.com",
        "Pending Connection Request",
        `From ${request.fromUserId.firstName} to ${request.toUserId.firstName}`,
      );

      console.log("Email Sent");
      request.reminderSent = true;
      await request.save();
      console.log("Reminder Updated");
    }
  } catch (err) {
    console.log(err);
  }
});
