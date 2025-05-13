import { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { Heart } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useParams } from 'react-router-dom';
import { addToCart, addToWishlist, getProductById } from '../../services/shopper';
import toast from 'react-hot-toast';

type Product = {
  id: number;
  title: string;
  price: number;
  description?: string;
  category: string;
  image: string;
  rate: number;
  quantity: number;
  available: number;
};

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);

  const userId = (localStorage.getItem('userId'));
  if (!userId) {
    alert('You must be logged in to add to wishlist.');
    return;
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(Number(id));
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  //console.log('Token:', localStorage.getItem('token'));

  const handleAddToWishlist = async () => {
    if (!product) return;
    //console.log('Adding to wishlist:', product.id, userId);
    try {
      await addToWishlist(product.id);
      toast.success('Product added to wishlist!');
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error adding to wishlist');
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart(product.id, selectedQuantity);
      toast.success('Product added to cart!');
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error adding to cart');

    }
  };

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
                onClick={handleAddToWishlist}
                className={`w-6 h-6 cursor-pointer transition-colors duration-200 ${inWishlist ? 'text-red-500 fill-red-500' : 'text-gray-400'
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
