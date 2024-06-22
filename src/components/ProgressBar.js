import React from "react";
import "@styles/ProgressBar.css";

const ProgressBar = ({ percentage }) => {
  return (
    <div className="progress-bar-container rounded-full max-w-xl relative bg-indigo-50">
      <div
        className="progress-bar rounded-full"
        style={{ width: `${percentage}%` }}
      ></div>
      <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-light text-black text-lg font-geologica font-bold">
        {percentage}%
      </p>
    </div>
  );
};

export default ProgressBar;
