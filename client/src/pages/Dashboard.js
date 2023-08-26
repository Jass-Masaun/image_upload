import React, { useEffect, useState } from "react";

import {
  getAllImages,
  getUserDetails,
  uploadImages,
} from "../utils/apis/dashboard";

import Loading from "../components/Loading";
import NavBar from "../components/NavBar";
import ImageView from "../components/ImageView";

const Dashboard = () => {
  const [images, setImages] = useState([]);
  const [isMultiple, setIsMultiple] = useState(false);
  const [uploadImageVisibility, setUploadImageVisibility] = useState(false);
  const [uploadButtonVisibility, setUploadButtonVisibility] = useState(true);
  const [apiLoading, setApiLoading] = useState(true);
  const [uploadButtonDisabled, setUploadButtonDisabled] = useState(false);
  const [showUploadingStatus, setShowUploadingStatus] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    const handleInitialPageLoad = async () => {
      const imagesArr = await getAllImages();
      const userD = await getUserDetails();

      if (userD.tier !== "free") {
        setIsMultiple(true);
      }

      setImages(imagesArr);
      setApiLoading(false);
    };

    handleInitialPageLoad();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setSelectedImages(imageUrls);
  };

  const handleUploadImageButton = () => {
    setUploadImageVisibility(true);
    setUploadButtonVisibility(false);
  };

  const handleSubmit = async (event) => {
    let reload = true;
    try {
      event.preventDefault();

      const file = event.currentTarget["images"].files[0];

      if (!file) {
        reload = false;
        alert("Please select any image first");
      } else {
        setUploadButtonDisabled(true);
        setShowUploadingStatus(true);
        let files = [file];
        if (isMultiple) {
          files = event.currentTarget["images"].files;
        }
        await uploadImages({ images: files });
      }
    } catch (error) {
      console.log(error);
      alert("unknown error");
    } finally {
      if (reload) {
        window.location.reload();
      }
    }
  };

  return (
    <>
      <NavBar
        buttons={[
          { name: "User Profile", path: "/user" },
          { name: "Plans", path: "/plans" },
        ]}
      />

      {!apiLoading ? (
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
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                Upload Image{isMultiple ? "(s)" : ""}
              </h2>

              <form onSubmit={handleSubmit} className="mb-8">
                <label className="block text-gray-700 mb-2">
                  Select Image{isMultiple ? "(s)" : ""}
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    name="images"
                    accept=".jpg, .jpeg, .png, .gif"
                    className="hidden"
                    id="imageUpload"
                    multiple={isMultiple}
                    onChange={handleImageChange}
                    disabled={uploadButtonDisabled}
                  />
                  <label
                    htmlFor="imageUpload"
                    className="cursor-pointer bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300 ease-in-out"
                  >
                    Choose Image{isMultiple ? "s" : ""}
                  </label>
                </div>
                {selectedImages.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">
                      Selected Image{isMultiple ? "s" : ""} Preview:
                    </h3>
                    <div className="flex space-x-4">
                      {selectedImages.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Selected Preview ${index + 1}`}
                          className="w-32 h-32 object-cover rounded"
                        />
                      ))}
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  className="bg-gray-800 text-white py-2 px-4 rounded-lg mt-4 hover:bg-gray-700 transition duration-300 ease-in-out"
                  disabled={uploadButtonDisabled}
                >
                  Upload
                </button>
              </form>
            </div>
          )}

          {showUploadingStatus && (
            <label className="block text-gray-700 mb-2">
              Your image{isMultiple ? "s are" : " is"} uploading please wait...
            </label>
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
