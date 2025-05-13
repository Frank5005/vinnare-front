import { useEffect, useState } from "react";
import { getWishlist } from "../services/shopper";

interface Product {
  id: number;
  ownerId: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  approved: boolean;
  quantity: number;
  available: number;
}

const ShowWishList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  const hasMore = visibleCount < products.length;

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const wishlist = await getWishlist();
        setProducts(wishlist);
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

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
  };
};

export default ShowWishList;
