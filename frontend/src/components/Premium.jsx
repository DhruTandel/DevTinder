import React from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";

const Premium = () => {

  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  // console.log(user);
    console.log("USER", user);
console.log("isPremium", user?.isPremium);

  const handleBuy = async (type) => {
    try {
      const order = await axios.post(
        BASE_URL + "/payment/create",
        {
          membershipType: type,
        },
        { withCredentials: true },
      );

      const { keyId, amount, currency, orderID, notes } = order.data;
      const options = {
        key: keyId,
        amount,
        currency,
        name: "DevTinder",
        description: "Connect to other Developers",
        order_id: orderID,
        handler: async function (response) {
          console.log("Payment success");
          console.log(response);

          const verify = await axios.post(
            BASE_URL + "/payment/verify",
            response,
            { withCredentials: true },
          );
          // if (verify.data.isPremium) {
          // }

          console.log(verify.data);

          const updatedUser = await axios.get(BASE_URL + "/profile/view", {
            withCredentials: true,
          });
          console.log(updatedUser.data.data);
          dispatch(addUser(updatedUser.data.data));
        },
        prefill: {
          name: notes.firstName + " " + notes.lastName,
          email: notes.emailId,
          contact: "9999999999",
        },
        theme: {
          color: "#F37254",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        console.log("Payment Failed");
        console.log(response);
      });
      rzp.open();
    } catch (err) {
      console.log(err);
    }
  };

  if (!user) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );
}

  if (user?.isPremium) {
    return <div>👑 You are already a Premium User</div>;
  } else {
    return (
      <div className="min-h-screen bg-base-200 flex justify-center items-center p-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Silver Plan */}
          <div className="card w-96 bg-base-100 shadow-xl border border-gray-300">
            <div className="card-body">
              <h2 className="card-title text-3xl">🥈 Silver Membership</h2>

              <h3 className="text-4xl font-bold mt-4">₹300</h3>
              <p className="text-gray-500">per month</p>

              <ul className="mt-6 space-y-3">
                <li>✅ 50 Connection Requests / Day</li>
                <li>✅ Priority Profile Visibility</li>
                <li>✅ Basic Support</li>
                <li>✅ Unlimited Profile Views</li>
              </ul>

              <div className="card-actions justify-center mt-8">
                <button
                  className="btn btn-primary w-full"
                  onClick={() => handleBuy("silver")}
                >
                  Buy Silver
                </button>
              </div>
            </div>
          </div>

          {/* Gold Plan */}
          <div className="card w-96 bg-yellow-100 shadow-xl border-2 border-yellow-500">
            <div className="card-body">
              <h2 className="card-title text-3xl text-black">
                👑 Gold Membership
              </h2>

              <h3 className="text-4xl font-bold mt-4 text-black">₹700</h3>
              <p className="text-black">per month</p>

              <ul className="mt-6 space-y-3 text-black">
                <li>✅ Unlimited Connection Requests</li>
                <li>✅ Top Search Ranking</li>
                <li>✅ Premium Badge</li>
                <li>✅ Advanced Filters</li>
                <li>✅ Priority Support</li>
                <li>✅ See Who Viewed Profile</li>
              </ul>

              <div className="card-actions justify-center mt-8">
                <button
                  className="btn btn-warning w-full"
                  onClick={() => handleBuy("gold")}
                >
                  Buy Gold
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Premium;
