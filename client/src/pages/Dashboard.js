import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

import { ACCESS_TOKEN_KEY } from "../utils/constants";
import {
  getAllImages,
  getUserDetails,
  uploadImages,
} from "../utils/apis/dashboard";

const Dashboard = () => {
  const [images, setImages] = useState([]);
  // const [userDetails, setUserDetails] = useState({});
  const [isMultiple, setIsMultiple] = useState(false);

  useEffect(async () => {
    const imagesArr = await getAllImages();
    const userD = await getUserDetails();
    if (userD.tier !== "free") {
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
            <button className="text-white" onClick={handleUserProfile}>
              User Profile
            </button>
            <button className="text-white" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Upload Image</h2>

        <form onSubmit={handleSubmit} className="mb-8">
          <label className="block text-gray-700 mb-2">Select Image(s):</label>
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
            <span className="text-gray-600" id="selectedFileName">
              No file selected
            </span>
          </div>
          <button
            type="submit"
            className="bg-gray-800 text-white py-2 px-4 rounded-lg mt-4 hover:bg-gray-700 transition duration-300 ease-in-out"
          >
            Upload
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.length > 0 ? (
            <>
              <h3 className="text-xl font-bold col-span-full mb-4 text-gray-900">
                Your uploaded images
              </h3>
              {images.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img.view_link}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <a
                    href={img.download_link}
                    download={`image-${index + 1}.jpg`}
                    className="absolute bottom-2 right-2 px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition duration-300 ease-in-out"
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </a>
                </div>
              ))}
            </>
          ) : (
            <p className="text-lg text-gray-700 col-span-full">
              No image uploaded.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
