import React from "react";

const PlanCard = ({ plan, selectedPlan, handleSelectPlan }) => {
  return (
    <div
      key={plan.id}
      className={`w-64 m-4 bg-white p-6 rounded-lg shadow-md ${
        selectedPlan === plan.id
          ? "border-2 border-gray-500"
          : "border border-gray-300"
      } hover:shadow-lg transition duration-300 ease-in-out text-center`}
    >
      <h2 className="text-xl font-semibold mb-2 text-gray-800">{plan.name}</h2>
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
  );
};

export default PlanCard;
