import React from "react";
import { ACCESS_TOKEN_KEY } from "../utils/constants";

// const Dashboard = () => {
//   const handleClick = () => {
//     window.localStorage.removeItem(ACCESS_TOKEN_KEY);
//     window.location.href = "/";
//   };
//   return (
//     <div>
//       <h1 className="text-3xl font-bold text-gray-700">Dashboard Page</h1>
//       <button onClick={handleClick}>Logout</button>
//     </div>
//   );
// };

/*
  This example requires some changes to your config:
  
  
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/aspect-ratio'),
    ],
  }
  
*/
// const files = [
//   {
//     title: "IMG_4985.HEIC",
//     size: "3.9 MB",
//     source:
//       "https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80",
//   },
//   // More files...
// ];

// const Dashboard = () => {
//   return (
//     <ul
//       role="list"
//       className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
//     >
//       {files.map((file) => (
//         <li key={file.source} className="relative">
//           <div className="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
//             <img
//               src={file.source}
//               alt=""
//               className="pointer-events-none object-cover group-hover:opacity-75"
//             />
//             <button
//               type="button"
//               className="absolute inset-0 focus:outline-none"
//             >
//               <span className="sr-only">View details for {file.title}</span>
//             </button>
//           </div>
//           <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">
//             {file.title}
//           </p>
//           <p className="pointer-events-none block text-sm font-medium text-gray-500">
//             {file.size}
//           </p>
//         </li>
//       ))}
//     </ul>
//   );
// };

const images = [
  "http://localhost:5000/api/v1/image/view?id=64e6f765af228a9b6755dd25",
  "https://example.com/image2.jpg",
  // Add more image URLs here
];

const Dashboard = () => {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {images.map((imageUrl, index) => (
        <div key={index} className="relative">
          <img
            src={imageUrl}
            alt={`Image ${index + 1}`}
            className="w-full h-full object-cover"
          />
          <a
            href={
              "http://localhost:5000/api/v1/image/download?id=64e6f227a736f93e1d757b7c"
            }
            download={`image-${index + 1}.jpg`}
            className="absolute bottom-2 right-2 px-2 py-1 bg-blue-500 text-white rounded"
          >
            Download
          </a>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
