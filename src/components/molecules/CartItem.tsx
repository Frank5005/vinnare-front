import { Item } from "../../types/Item";
import React from 'react';

interface CartItemProps {
  id: number;
  title: string;
  quantity: number;
  //vendor: string;
  price: number;
  image: string;
  //inCartStart: boolean;
  onToggleCart: (productId: number) => void;
}

const CartItem = ({ title, quantity, price, image, id, onToggleCart }: CartItemProps) => (

  <div className="flex border-b pb-6">
    {/* Image */}
    <img
      src={image}
      alt={title}
      className="w-24 h-24 object-cover mr-4 flex-shrink-0 rounded"
    />
    {/* Info */}
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="text-sm text-gray-600">Quantity: {quantity}</p>
          <p className="text-lg font-bold">${price}</p>
        </div>
        <div className="flex items-end">
          <p  onClick={() => onToggleCart(id)} className="text-sm text-gray-600 underline cursor-pointer">Remove</p>
        </div>
      </div>
    </div>
  </div>
);

export default CartItem;

//<p>Size: {item.size}</p>
//<p className="text-sm text-gray-500 mt-1">by {item.vendor}</p>