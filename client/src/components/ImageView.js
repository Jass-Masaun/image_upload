import React from "react";
import ImageGrid from "./ImageGrid";

const ImageView = ({ images }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.length > 0 ? (
        <>
          <h3 className="text-xl font-bold col-span-full mb-4 text-gray-900">
            Your uploaded images
          </h3>
          {images.map((img, index) => (
            <ImageGrid key={index} index={index} img={img} />
          ))}
        </>
      ) : (
        <p className="text-lg text-gray-700 col-span-full">
          No image uploaded.
        </p>
      )}
    </div>
  );
};

export default ImageView;
