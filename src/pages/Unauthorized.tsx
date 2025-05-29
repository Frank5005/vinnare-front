import React from "react";

const Unauthorized = () => {
  return (
    <div data-testid="unauthorized-container" className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-6xl font-bold text-red-600 mb-4">Not found</h1>
      <p className="text-2xl text-gray-800 mb-2"> What you were looking for was not found or you do not have permission to access.</p>
      <p className="text-lg text-gray-500">Please check the URL or contact the administrator.</p>
    </div>
  );
};

export default Unauthorized;