import { Heart } from 'lucide-react';
import { useNavigate } from "react-router-dom";
//import { Product } from "../../types/product";

interface ProductComponentProps {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  inWishlistStart: boolean;
  onToggleWishlist: (productId: number) => void;
}

const ProductComponent = ({ id, name, price, imageUrl, inWishlistStart, onToggleWishlist}: ProductComponentProps) => {
  
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div>
      <img onClick={handleClick} src={imageUrl} alt={name} className="w-full h-48 object-cover mb-4" />

      <div className="flex justify-between items-start mt-4">
        <div className="flex flex-col leading-tight">
          <span className="text-base font-semibold text-gray-900">{name}</span>
          <span className="text-sm text-gray-600">${price}</span>
        </div>
        <Heart
          onClick={() => onToggleWishlist(id)}
          className={`w-5 h-5 cursor-pointer transition-colors ${inWishlistStart ? 'text-red-500 fill-red-500' : 'text-gray-400'
            }`}
        />
      </div>
    </div>
  );

};

export default ProductComponent;