import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import PaymentForm from "../components/PaymentForm";

import { getUserDetails } from "../utils/apis/dashboard";
import { ACCESS_TOKEN_KEY } from "../utils/constants";
import { getAllSubscriptionPlans } from "../utils/apis/stripe";

const UserDetails = () => {
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [userDetails, setUserDetails] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [plans, setPlans] = useState([]);
  const [userPlanDetails, setUserPlanDetails] = useState({});
  const [selectedPlanDetails, setSelectedPlanDetails] = useState({});

  const stripePromise = loadStripe(
    "pk_test_51Ni8q6SHl18hJPkqdUsQBF4rvB8cOlJoRy5FyBhJ4ZCaaXb7r7pNVluFK5v044fPv11OAkXat6vlcvW9dnfYN2A900Yl719mGO"
  );

  useEffect(async () => {
    const userDetailsResult = await getUserDetails();
    setUserDetails(userDetailsResult);

    const plansList = await getAllSubscriptionPlans();
    setPlans(plansList.plans);

    plansList.plans.forEach((plan) => {
      if (plan.selected) {
        setSelectedPlan(plan.id);
        setUserPlanDetails(plan);
      }
    });
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.location.href = "/login";
  };

  const handleDashboard = async () => {
    window.location.href = "/dashboard";
  };

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);

    plans.forEach((plan) => {
      if (plan.id === planId) {
        setSelectedPlanDetails(plan);
      }
    });

    if (userPlanDetails.id === planId) {
      setShowForm(false);
    } else {
      setShowForm(true);
    }
  };

  return (
    <>
      <nav className="bg-gray-500 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-white text-xl font-bold">
            Dashboard
          </Link>
          <div className="flex items-center space-x-4">
            <button className="text-white" onClick={handleDashboard}>
              Dashboard
            </button>
            <button className="text-white" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">User Details</h2>
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">User Information</h3>
          <p>
            Name: {userDetails.fullName} <br />
            Email: {userDetails.email}
          </p>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Current Plan</h3>
          <p>Selected Plan: {userPlanDetails.name}</p>
          <button
            className="bg-blue-500 text-white py-1 px-4 rounded mt-2"
            // onClick={() => handlePlanChange(changePlan)}
          >
            {userPlanDetails?.name?.toLowerCase() === "free plan"
              ? "Upgrade to Monthly"
              : "Downgrade to Free"}
          </button>
        </div>
      </div>
      <div className="flex flex-wrap justify-center">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`max-w-xs m-4 bg-white p-6 rounded-lg shadow-md ${
              selectedPlan === plan.id ? "border-2 border-blue-500" : ""
            }`}
          >
            <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
            <p className="mb-4">
              ${plan.amount} / {plan.interval}
            </p>
            <button
              className={`${
                selectedPlan === plan.id ? "bg-blue-500" : "bg-gray-300"
              } text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition`}
              onClick={() => handleSelectPlan(plan.id)}
            >
              {selectedPlan === plan.id ? "Selected" : "Select"}
            </button>
          </div>
        ))}
      </div>
      {showForm && (
        <Elements stripe={stripePromise}>
          <PaymentForm
            planDetails={{
              ...selectedPlanDetails,
              user_subscribed_plan_id: userPlanDetails.id,
            }}
            userDetails={userDetails}
          />
        </Elements>
      )}
    </>
  );
};

export default UserDetails;
