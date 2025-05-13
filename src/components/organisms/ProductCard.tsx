import React from "react";

interface ProductCardProps {
  image: string;
  name: string;
  price: string | number;
}

const ProductCard: React.FC<ProductCardProps> = ({ image, name, price }) => (
  <div className="flex flex-col items-start w-40 md:w-60">
    <div className="w-full h-40 md:h-56 bg-gray-300 rounded-md overflow-hidden flex items-center justify-center">
      <img src={image} alt={name} className="object-cover w-full h-full" />
    </div>
    <span className="mt-2 font-semibold">{name}</span>
    <span className="text-sm">${price}</span>
  </div>
);

export default ProductCard;