import axios from "axios";
import { ACCESS_TOKEN_KEY, BASE_URL } from "../constants";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "*/*",
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

axiosClient.interceptors.request.use((config) => {
  const accessToken = `bearer ${window?.localStorage?.getItem(
    ACCESS_TOKEN_KEY
  )}`;

  if (accessToken) {
    config.headers["authorization"] = accessToken;
  }

  return Promise.resolve(config);
});

const getData = async (endpoint) => {
  try {
    const response = await axiosClient.get(endpoint);
    return response;
  } catch (error) {
    if (error?.response?.status === 401) {
      window?.localStorage?.removeItem(ACCESS_TOKEN_KEY);
      window.location.href = "/login";
    }

    return error.response;
  }
};

const postData = async (endpoint, payload, headers) => {
  try {
    headers = headers || {
      Accept: "*/*",
      "Content-Type": "application/json",
    };
    const response = await axiosClient.post(endpoint, payload, headers);
    return response;
  } catch (error) {
    if (error?.response?.status === 401) {
      window?.localStorage?.removeItem(ACCESS_TOKEN_KEY);
      window.location.href = "/login";
    }
    if (error?.code === "ERR_NETWORK") {
      return {
        data: {
          message:
            "because of vercel restriction max body size must be less than 4.5mb",
        },
      };
    }

    return error.response;
  }
};

export { getData, postData };
