import { ACCESS_TOKEN_KEY } from "../constants";
import { postData, getData } from "../services";

const getAllSubscriptionPlans = async () => {
  try {
    const response = await getData("/stripe/get-all-plans");
    const responseStatusCode = response?.data?.status_code;
    const responseMessage = response?.data?.message;
    if (responseStatusCode === 200 || responseStatusCode === 201) {
      const plans = response.data.data;
      return plans;
    } else {
      alert(responseMessage);
      return null;
    }
  } catch (error) {
    console.log(error);
    alert("unknown error occured while signup");
    return null;
  }
};

const subscribeToPlan = async (payload) => {
  try {
    const response = await postData("/stripe/subscribe-plan", payload);
    const responseStatusCode = response?.data?.status_code;
    const responseMessage = response?.data?.message;
    if (responseStatusCode === 200 || responseStatusCode === 201) {
      return response.data.data;
    } else {
      alert(responseMessage);
      return null;
    }
  } catch (error) {
    console.log(error);
    alert("unknown error occured while signup");
    return null;
  }
};

const cancelSubscriptionToPlan = async (payload) => {
  try {
    const response = await postData("/stripe/cancel-subscription", payload);
    const responseStatusCode = response?.data?.status_code;
    const responseMessage = response?.data?.message;
    if (responseStatusCode === 200 || responseStatusCode === 201) {
      return true;
    } else {
      alert(responseMessage);
      return false;
    }
  } catch (error) {
    console.log(error);
    alert("unknown error occured while signup");
    return false;
  }
};

export { getAllSubscriptionPlans, subscribeToPlan, cancelSubscriptionToPlan };
