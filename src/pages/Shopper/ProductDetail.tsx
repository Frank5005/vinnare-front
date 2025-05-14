import { useEffect, useState } from 'react';
import Footer from '../../components/organisms/Footer';
import Header from '../../components/organisms/Header';
import { Heart } from 'lucide-react';
import Button from '../../components/atoms/Button';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Product } from "../../types/Product";
import { getWishlist, addToWishlist, removeFromWishlist, addToCart, getProductById, getCart } from "../../services/shopperService";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [inWishlist, setWishList] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const userId = (localStorage.getItem('userId'));
  if (!userId) {
    alert('You must be logged in to add to wishlist.');
    return;
  }


  useEffect(() => {
    fetchWishList();
    fetchCart();
    fetchProduct();
  }, [id]);

  const fetchWishList = async () => {
    setIsLoading(true);
    try {
      const wishlistProducts = await getWishlist();
      const ids = wishlistProducts.map((p: any) => p.id);
      //setProducts(wishlistProducts);
      setWishlistIds(ids);
      //console.log(ids);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProduct = async () => {
    try {
      const wishlistProducts = await getWishlist();
      const ids = wishlistProducts.map((p: any) => p.id);
      const data = await getProductById(Number(id));
      setProduct(data);
      setWishList(ids.includes(data.id));
      console.log(ids);

    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    const cart = await getCart();
    setCart(cart);
    console.log(cart);
  };

  const handleAddToCart = async () => {
    if (!product) return;

    const cartIds = cart.map((p) => p.id);
    const filteredIds = wishlistIds.filter((id) => !cartIds.includes(id));

    if (filteredIds.length === 0) {
      toast("The product is already in the cart.");
      return;
    }

    try {
      await addToCart(product.id, selectedQuantity);
      toast.success('Product added to cart!');
    } catch (error) {
      console.error(error);
      toast.error('Error adding to cart');
    }
  };

  const ToggleWishlist = async () => {
    if (!product) return;


    try {
      if (inWishlist) {
        const remove = await removeFromWishlist(product.id);
        setWishList(false);
        console.log(remove);
      } else {
        const add = await addToWishlist(userId, product.id);
        setWishList(true);
        console.log(add);
      }
    } catch (error) {
      console.error("Error updating wishlist", error);
    }
  }

  if (loading) return <p className="p-6">Loading...</p>;
  if (!product) return <p className="p-6 text-red-600">Product not found</p>;

  const isOutOfStock = product.available === 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header sticky */}
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      {/* Main content */}
      <main className="flex-1 p-6">
        <div className="flex flex-col md:flex-row gap-8 bg-white rounded-lg shadow-md p-6">
          {/* Product Image */}
          <div className="flex-1">
            <img
              src={product.image}
              alt={product.title}
              className="rounded-lg w-full max-w-lg object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-semibold">{product.title}</h1>
              <Heart
                onClick={ToggleWishlist}
                className={`w-5 h-5 cursor-pointer transition-colors ${inWishlist ? 'text-red-500 fill-red-500' : 'text-gray-400'
                  }`}
              />
            </div>

            <p className="text-xl font-bold">${product.price}</p>
            <p className="text-gray-600">{product.description}</p>

            {isOutOfStock ? (
              <p className="text-red-600 font-semibold">Out of Stock</p>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <label htmlFor="quantity">Quantity:</label>
                  <input
                    type="number"
                    id="quantity"
                    value={selectedQuantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setSelectedQuantity(val);
                    }}
                    min={1}
                    max={product.available}
                    className="w-16 border rounded px-2 py-1"
                  />
                  <span className="text-sm text-gray-500">
                    (Max: {product.available})
                  </span>
                </div>

                <Button onClick={handleAddToCart}>
                  Add to Cart – ${product.price * selectedQuantity}
                </Button>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProductDetail;
