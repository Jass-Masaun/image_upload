import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const ImageGrid = ({ index, img }) => {
  return (
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
  );
};

export default ImageGrid;
