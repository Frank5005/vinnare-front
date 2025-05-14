import React from "react";

interface StaggeredImageGridProps {
  images: string[]; 
  altTexts?: string[];
}

const StaggeredImageGrid: React.FC<StaggeredImageGridProps> = ({ images, altTexts = [] }) => (
  <div className="flex justify-center items-end gap-6 w-full py-8">

    <div className="w-48 h-64 bg-gray-300 rounded-md overflow-hidden flex items-center justify-center">
      <img src={images[0]} alt={altTexts[0] || "left"} className="object-cover w-full h-full" />
    </div>

    <div className="w-48 h-80 bg-gray-300 rounded-md overflow-hidden flex items-center justify-center -mb-8">
      <img src={images[1]} alt={altTexts[1] || "center"} className="object-cover w-full h-full" />
    </div>

    <div className="w-48 h-64 bg-gray-300 rounded-md overflow-hidden flex items-center justify-center">
      <img src={images[2]} alt={altTexts[2] || "right"} className="object-cover w-full h-full" />
    </div>
  </div>
);

export default StaggeredImageGrid;