import { ACCESS_TOKEN_KEY } from "../constants";
import { postData } from "../services";

const createUser = async (payload) => {
  try {
    const response = await postData("/auth/create-user", payload);
    const responseStatusCode = response?.data?.status_code;
    const responseMessage = response?.data?.message;
    if (responseStatusCode === 200 || responseStatusCode === 201) {
      alert(responseMessage);
      window.location.href = "/login";
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

const loginUser = async (payload) => {
  try {
    const response = await postData("/auth/login-user", payload);
    const responseStatusCode = response?.data?.status_code;
    const responseMessage = response?.data?.message;
    if (responseStatusCode === 200 || responseStatusCode === 201) {
      window?.localStorage?.setItem(
        ACCESS_TOKEN_KEY,
        response?.data?.data?.accessToken
      );
      window.location.href = "/dashboard";
      return true;
    } else {
      alert(responseMessage);
      return false;
    }
  } catch (error) {
    console.log(error);
    alert("unknown error occured while login");
    return false;
  }
};

export { createUser, loginUser };
