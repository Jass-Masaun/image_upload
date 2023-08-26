import React, { useState, useEffect } from "react";

import Loading from "../components/Loading";
import NavBar from "../components/NavBar";

import { getUserDetails } from "../utils/apis/dashboard";
import { getAllSubscriptionPlans } from "../utils/apis/stripe";
import { Link } from "react-router-dom";

const UserDetails = () => {
  const [userDetails, setUserDetails] = useState({});

  const [userPlanDetails, setUserPlanDetails] = useState({});

  useEffect(() => {
    const handleInitialPageLoad = async () => {
      const userDetailsResult = await getUserDetails();
      setUserDetails(userDetailsResult);

      const plansList = await getAllSubscriptionPlans();

      plansList.plans.forEach((plan) => {
        if (plan.selected) {
          setUserPlanDetails(plan);
        }
      });
    };

    handleInitialPageLoad();
  }, []);

  return (
    <>
      <NavBar buttons={[{ name: "Plans", path: "/plans" }]} />

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
          <div className="max-w-md mx-auto p-4 bg-white">
            <Link
              to="/plans"
              className="w-full bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition"
            >
              Change Plan
            </Link>
          </div>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default UserDetails;
