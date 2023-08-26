import React, { useState, useEffect } from "react";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { getAllSubscriptionPlans } from "../utils/apis/stripe";
import { getUserDetails } from "../utils/apis/dashboard";

import PaymentForm from "../components/PaymentForm";
import PlanCard from "../components/PlanCard";
import Loading from "../components/Loading";
import NavBar from "../components/NavBar";

import { STRIPE_PUBLISHABLE_KEY } from "../utils/constants";

const Plans = () => {
  const [userDetails, setUserDetails] = useState({});
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [showForm, setShowForm] = useState(false);
  const [plans, setPlans] = useState([]);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState({});
  const [userPlanDetails, setUserPlanDetails] = useState({});

  const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

  useEffect(() => {
    const handleInitialPageLoad = async () => {
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
    };

    handleInitialPageLoad();
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
      <NavBar buttons={[{ name: "User Profile", path: "/user" }]} />
      {userPlanDetails.id ? (
        <div className="flex flex-wrap justify-center">
          {plans.map((plan, index) => (
            <PlanCard
              key={index}
              plan={plan}
              selectedPlan={selectedPlan}
              handleSelectPlan={handleSelectPlan}
            />
          ))}
        </div>
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

export default Plans;
