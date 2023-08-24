import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { ACCESS_TOKEN_KEY } from "../utils/constants";
import { getAllImages, uploadImages } from "../utils/apis/dashboard";

const Dashboard = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const allowedFormats = ["image/jpeg", "image/png", "image/gif"];

  useEffect(async () => {
    const imagesArr = await getAllImages();
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
      const result = await uploadImages({ images: file });
    } catch (error) {
      alert("unknown error");
    }
  };

  return (
    <>
      <nav className="bg-gray-500 p-4">
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
      <form onSubmit={handleSubmit}>
        <div className="container mx-auto p-4">
          <h2 className="text-2xl font-bold mb-4">Upload Image</h2>

          <input
            // name="images"
            id="images"
            type="file"
            accept=".jpg, .jpeg, .png, .gif"
            // onChange={handleImageUpload}
          />
        </div>
        <input type="submit" />
      </form>
      <div className="grid grid-cols-3 gap-4 p-4">
        {images.map((img, index) => (
          <div key={index} className="relative">
            <img
              src={img.view_link}
              alt={`Image ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <a
              href={img.download_link}
              download={`image-${index + 1}.jpg`}
              className="absolute bottom-2 right-2 px-2 py-1 bg-blue-500 text-white rounded"
            >
              Download
            </a>
          </div>
        ))}
      </div>
    </>
  );
};

export default Dashboard;
