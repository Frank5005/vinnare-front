//import ProductComponent from '..';
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
//import { FaHeart } from "react-icons/fa";
import { Heart } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { addToWishlist, removeFromWishlist, getWishlistItemId } from "../../services/shopper";

interface ProductComponentProps {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  inWishlistStart: boolean;
  //showFavorite?: boolean;
}

const ProductComponent = ({ id, name, price, imageUrl, inWishlistStart }: ProductComponentProps) => {
  const [inWishlist, setInWishlist] = useState(inWishlistStart);
  const [wishlistId, setWishlistId] = useState<number | null>(null);

  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${id}`);
  };

  useEffect(() => {
    const fetchWishlistId = async () => {
      if (!userId || !inWishlistStart) return;
      const ide = await getWishlistItemId(id);
      setWishlistId(ide);
    };

    fetchWishlistId();
  }, [id, userId, inWishlistStart]);

  const handleToggleWishlist = async () => {
    if (!userId) {
      toast.error('You must be logged in');
      return;
    }

    try {
      if (inWishlist) {
        if (wishlistId) {
          await removeFromWishlist(wishlistId);
          toast.success('Removed from wishlist');
        }
        setWishlistId(null);
        setInWishlist(false);
      } else {
        const result = await addToWishlist(userId, id);
        toast.success('Added to wishlist');
        setInWishlist(true);
        setWishlistId(result.id); // asumimos que backend devuelve el id
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Error updating wishlist'
      );
    }
  };

  return (
    <div onClick={handleClick}>
      <img src={imageUrl} alt={name} className="w-full h-48 object-cover mb-4" />

      <div className="flex justify-between items-start mt-4">
        <div className="flex flex-col leading-tight">
          <span className="text-base font-semibold text-gray-900">{name}</span>
          <span className="text-sm text-gray-600">${price}</span>
        </div>
        <Heart
          onClick={handleToggleWishlist}
          className={`w-5 h-5 cursor-pointer transition-colors ${inWishlist ? 'text-red-500 fill-red-500' : 'text-gray-400'
            }`}
        />
      </div>
    </div>
  );

};

export default ProductComponent;