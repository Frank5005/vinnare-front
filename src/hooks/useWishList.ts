import { useEffect, useState } from "react";
import { getWishlist, removeFromWishlist, addToWishlist } from "../services/shopperService";
import { Product } from "../types/Product";

const ShowWishList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  const hasMore = visibleCount < products.length;
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchWishList = async () => {
      setIsLoading(true);
      try {
        const wishlistProducts = await getWishlist();
        const ids = wishlistProducts.map((p: any) => p.id);
        setProducts(wishlistProducts);
        setWishlistIds(ids);
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishList();
  }, []);

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
    ToggleWishlist
  };
};

export default ShowWishList;
