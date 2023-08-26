import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import {
  cancelSubscriptionToPlan,
  subscribeToPlan,
} from "../utils/apis/stripe";

const PaymentForm = ({ planDetails, userDetails }) => {
  const [payButtonDisabled, setPayButtonDisabled] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const createSubscription = async (e) => {
    setPayButtonDisabled(true);

    e.preventDefault();

    const formData = new FormData(e.target);
    const address = {
      line1: formData.get("address_line1"),
      city: formData.get("address_city"),
      state: formData.get("address_state"),
      country: formData.get("address_country"),
      postal_code: formData.get("address_postal_code"),
    };

    try {
      const cardElement = elements.getElement(CardElement);

      const { token, error } = await stripe.createToken(cardElement);
      if (error) {
        alert(error.message);
      } else {
        const response = await subscribeToPlan({
          planId: planDetails.id,
          stripeToken: token.id,
          address,
        });
        if (!response) {
          return alert("Subscription failed!");
        } else {
          const confirm = await stripe.confirmCardPayment(
            response.client_secret,
            {
              payment_method: {
                card: elements.getElement(CardElement),
              },
            }
          );
          if (confirm.error) {
            return alert(confirm.error.message);
          }
        }
      }
    } catch (err) {
      console.error(err);
      alert("Payment failed! " + err.message);
    } finally {
      window.location.reload();
    }
  };

  const cancelSubscription = async (e) => {
    setPayButtonDisabled(true);
    try {
      e.preventDefault();
      const response = await cancelSubscriptionToPlan({
        plan_id: planDetails.user_subscribed_plan_id,
      });
      if (!response) {
        return alert("Error cancelling subscription!");
      } else {
        alert("Subscription cancelled successfully");
      }
    } catch (error) {
      console.error(error);
      alert("Subscription cancellation failed! " + error.message);
    } finally {
      window.location.reload();
    }
  };

  return (
    <>
      {planDetails.amount === "0.00" ? (
        <form
          onSubmit={cancelSubscription}
          className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg"
        >
          <h1 className="text-2xl font-semibold mb-4">
            No need to make payment for free tier
          </h1>
          <p className="text-gray-600 mb-2">
            Note: Selecting this plan will cancel your existing subscription.
          </p>
          <button
            type="submit"
            className="w-full bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition"
            disabled={payButtonDisabled}
          >
            Select
          </button>
        </form>
      ) : (
        <form
          onSubmit={createSubscription}
          className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg"
        >
          <h1 className="text-2xl font-semibold mb-4">Make a Payment</h1>
          <div className="mb-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={userDetails.fullName}
              className="w-full p-2 border rounded-lg"
              disabled
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={userDetails.email}
              className="w-full p-2 border rounded-lg"
              disabled
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="address_line1"
              placeholder="Address Line 1"
              value={userDetails.address.line1}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="address_city"
              placeholder="City"
              value={userDetails.address.city}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="address_state"
              placeholder="State"
              value={userDetails.address.state}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="address_country"
              placeholder="Country"
              value={userDetails.address.country}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="address_postal_code"
              placeholder="Postal Code"
              value={userDetails.address.postal_code}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <CardElement className="p-2 border rounded-lg" />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition"
            disabled={payButtonDisabled}
          >
            Pay Now
          </button>
        </form>
      )}
    </>
  );
};

export default PaymentForm;
