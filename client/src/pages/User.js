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
      <nav className="bg-gray-800 p-4">
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
        <div className="bg-gray-100 p-4 rounded shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            User Information
          </h3>
          <div className="grid grid-cols-2 gap-2 text-gray-700">
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Name:</span>
              {userDetails.fullName}
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Email:</span>
              {userDetails.email}
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded mt-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            Current Plan
          </h3>
          <p className="text-gray-700">
            You are currently on the{" "}
            <span className="font-semibold">{userPlanDetails.name}</span>.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap justify-center">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`w-64 m-4 bg-white p-6 rounded-lg shadow-md ${
              selectedPlan === plan.id
                ? "border-2 border-gray-500"
                : "border border-gray-300"
            } hover:shadow-lg transition duration-300 ease-in-out text-center`}
          >
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              {plan.name}
            </h2>
            <ul className="mb-4 text-gray-700 list-disc pl-6 text-left">
              {" "}
              {/* Override text-center for ul */}
              {plan.benefits.map((benefit, index) => (
                <li key={index} className="mb-2 flex items-start">
                  <svg
                    className="mr-2 h-4 w-4 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M17.707 5.293a1 1 0 00-1.414-1.414L8 12.586l-3.293-3.293a1 1 0 10-1.414 1.414L7.586 14l-3.293 3.293a1 1 0 101.414 1.414L8 15.414l3.293 3.293a1 1 0 001.414-1.414L8.414 14l3.293-3.293a1 1 0 000-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {benefit}
                </li>
              ))}
            </ul>
            <p className="mb-4 text-gray-700">
              ${plan.amount} / {plan.interval}
            </p>
            <button
              className={`${
                selectedPlan === plan.id
                  ? "bg-gray-300 text-white"
                  : "bg-gray-800 text-white"
              } block w-full px-4 py-2 rounded-lg transition-colors duration-300 ease-in-out hover:bg-gray-300`}
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
