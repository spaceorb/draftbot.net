import React from "react";

const Shapes = () => {
  return (
    <div className="absolute flex flex-wrap items-center justify-center w-[100%]">
      {/* Pale yellow circle (moon) */}
      <div className="w-24 h-24 bg-yellow-200 rounded-full"></div>

      {/* Diamond */}
      <div className="concave-diamond w-16 h-16 bg-blue-400 transform rotate-45"></div>
    </div>
  );
};

export default Shapes;
