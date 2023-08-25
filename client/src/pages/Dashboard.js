import React, { useEffect, useState } from "react";

import { ACCESS_TOKEN_KEY } from "../utils/constants";
import {
  getAllImages,
  getUserDetails,
  uploadImages,
} from "../utils/apis/dashboard";
import Loading from "../components/Loading";
import NavBar from "../components/NavBar";
import ImageGrid from "../components/ImageGrid";
import ImageView from "../components/ImageView";

const Dashboard = () => {
  const [images, setImages] = useState([]);
  const [isMultiple, setIsMultiple] = useState(false);
  const [uploadImageVisibility, setUploadImageVisibility] = useState(false);
  const [uploadButtonVisibility, setUploadButtonVisibility] = useState(true);

  useEffect(async () => {
    const imagesArr = await getAllImages();
    const userD = await getUserDetails();
    if (userD.tier !== "free") {
      console.log("hi");
      setIsMultiple(true);
    }
    // setUserDetails(userD);
    setImages(imagesArr);
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.location.href = "/login";
  };

  const handleUserProfile = async () => {
    window.location.href = "/user";
  };

  const handleUploadImageButton = () => {
    setUploadImageVisibility(true);
    setUploadButtonVisibility(false);
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();

      const file = event.currentTarget["images"].files[0];
      let files = [file];
      if (isMultiple) {
        files = event.currentTarget["images"].files;
      }
      await uploadImages({ images: files });
    } catch (error) {
      console.log(error);
      alert("unknown error");
    } finally {
      window.location.reload();
    }
  };

  return (
    <>
      <NavBar
        buttons={[{ name: "User Profile", handleClick: handleUserProfile }]}
      />

      {images.length ? (
        <div className="container mx-auto p-4">
          {uploadButtonVisibility && (
            <button
              type="submit"
              className="bg-gray-800 text-white py-2 px-4 rounded-lg mt-4 hover:bg-gray-700 transition duration-300 ease-in-out mb-8"
              onClick={handleUploadImageButton}
            >
              Upload Image{isMultiple ? "(s)" : ""}
            </button>
          )}
          {uploadImageVisibility && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                Upload Image{isMultiple ? "(s)" : ""}
              </h2>

              <form onSubmit={handleSubmit} className="mb-8">
                <label className="block text-gray-700 mb-2">
                  Select Image{isMultiple ? "(s)" : ""}:
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    name="images"
                    accept=".jpg, .jpeg, .png, .gif"
                    className="hidden"
                    id="imageUpload"
                    multiple={isMultiple}
                  />
                  <label
                    htmlFor="imageUpload"
                    className="cursor-pointer bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300 ease-in-out"
                  >
                    Choose Image{isMultiple ? "s" : ""}
                  </label>
                </div>
                <button
                  type="submit"
                  className="bg-gray-800 text-white py-2 px-4 rounded-lg mt-4 hover:bg-gray-700 transition duration-300 ease-in-out"
                >
                  Upload
                </button>
              </form>
            </div>
          )}

          <ImageView images={images} />
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Dashboard;
