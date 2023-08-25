import React, { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import PaymentForm from "../components/PaymentForm";
import Loading from "../components/Loading";
import NavBar from "../components/NavBar";
import PlanCard from "../components/PlanCard";

import { getUserDetails } from "../utils/apis/dashboard";
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
      <NavBar buttons={[]} />

      {userPlanDetails.id ? (
        <>
          <div className="container mx-auto p-4">
            <div className="bg-gray-100 p-4 rounded shadow-md">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                User Information
              </h3>
              <div className="flex flex-col text-gray-700">
                <div>
                  <span className="text-gray-600 mr-2">Name:</span>
                  {userDetails.fullName}
                </div>
                <div>
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
              <PlanCard
                plan={plan}
                selectedPlan={selectedPlan}
                handleSelectPlan={handleSelectPlan}
              />
            ))}
          </div>{" "}
        </>
      ) : (
        <Loading />
      )}

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
