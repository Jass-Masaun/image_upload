import { ACCESS_TOKEN_KEY } from "../constants";
import { getData, postData } from "../services";

const getAllImages = async () => {
  try {
    const response = await getData("/image/all");
    const responseStatusCode = response?.data?.status_code;
    const responseMessage = response?.data?.message;
    if (responseStatusCode === 200 || responseStatusCode === 201) {
      return response.data.data.images;
    } else {
      alert(responseMessage);
      return [];
    }
  } catch (error) {
    console.log(error);
    alert("unknown error occured while signup");
    return [];
  }
};

const getUserDetails = async () => {
  try {
    const response = await getData("/user/details");
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

const uploadImages = async (payload) => {
  const formData = new FormData();
  Object.values(payload.images).forEach((image) => {
    formData.append("images", image);
  });

  try {
    const response = await postData("/image/store", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const responseStatusCode = response?.data?.status_code;
    const responseMessage = response?.data?.message;
    if (responseStatusCode === 200 || responseStatusCode === 201) {
      alert(responseMessage);
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

export { getAllImages, getUserDetails, uploadImages };
