import React from "react";

interface CategoryCardProps {
  image: string;
  name: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ image, name }) => (
  <div className="flex flex-col items-center">
    <div className="w-40 h-40 bg-gray-300 rounded-md overflow-hidden flex items-center justify-center">
      <img src={image} alt={name} className="object-cover w-full h-full" />
    </div>
    <span className="mt-2 font-semibold">{name}</span>
  </div>
);

export default CategoryCard;