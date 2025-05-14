import { useEffect, useState } from "react";
import {
  getWishlist,
  removeFromWishlist,
  addToWishlist,
  addToCart,
  getCart,
} from "../services/shopperService";
import { Product } from "../types/Product";
import toast from "react-hot-toast";

const ShowWishList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  const hasMore = visibleCount < products.length;
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchWishList();
    fetchCart();
  }, []);

  const fetchWishList = async () => {
    setIsLoading(true);
    try {
      const wishlistProducts = await getWishlist();
      const ids = wishlistProducts.map((p: any) => p.id);
      setProducts(wishlistProducts);
      setWishlistIds(ids);
      //console.log(ids);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCart = async () => {
    const cart = await getCart();
    setCart(cart);
    console.log(cart);
  };

  const ShopAll = async (ids: Array<number>) => {
    const cartIds = cart.map((p) => p.id);
    const filteredIds = wishlistIds.filter((id) => !cartIds.includes(id));

    if (filteredIds.length === 0) {
      toast("All the products are already in the cart.");
      return;
    }

    for (const id of filteredIds) {
      console.log(id);
      try {
        const add = await addToCart(id, 1);
        console.log(add);
        const remove = await removeFromWishlist(id);
        console.log(remove);
      } catch (error) {
        console.log("Error while adding the products to the cart", error);
      }
    }

    await fetchWishList();
    await fetchCart();
    toast.success("Products added to the cart!");
  };

  const inWishlist = (productId: number) => {
    return wishlistIds.includes(productId);
  };

  const ToggleWishlist = async (productId: number) => {
    if (!userId) return;

    if (inWishlist(productId)) {
      const remove = await removeFromWishlist(productId);
      setWishlistIds((p) => p.filter((id) => id !== productId));
      console.log(remove);
    } else {
      const add = await addToWishlist(userId, productId);
      setWishlistIds((p) => [...p, productId]);
      console.log(add);
    }
  };

  useEffect(() => {
    let isScrolling: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      clearTimeout(isScrolling);
      isScrolling = setTimeout(() => {
        if (
          window.innerHeight + window.scrollY >=
            document.body.offsetHeight - 100 &&
          hasMore
        ) {
          setIsLoading(true);
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + 3, products.length));
            setIsLoading(false);
          }, 500);
        }
      }, 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, products]);

  return {
    products: products.slice(0, visibleCount),
    isLoading,
    hasMore,
    wishlistIds,
    ToggleWishlist,
    ShopAll,
  };
};

export default ShowWishList;
