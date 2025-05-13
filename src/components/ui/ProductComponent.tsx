//import ProductComponent from '..';
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface ProductComponentProps {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    //showFavorite?: boolean;
}

const ProductComponent = ({ id, name, price, imageUrl }: ProductComponentProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${id}`);
  };
  return (
    <div onClick={handleClick}>
  <img src={imageUrl} alt={name} className="w-full h-48 object-cover mb-4" />
  
  <div className="flex justify-between items-start mt-4">
    <div className="flex flex-col leading-tight">
      <span className="text-base font-semibold text-gray-900">{name}</span>
      <span className="text-sm text-gray-600">${price}</span>
    </div>
    <FaHeart className="text-2xl text-black-800 mt-1" />
  </div>
</div>
  );

};

export default ProductComponent;