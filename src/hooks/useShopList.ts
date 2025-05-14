import { useEffect, useState } from "react";
import { getProducts, getCategories, getWishlist, addToWishlist, removeFromWishlist } from "../services/shopperService";
import { Product } from "../types/product";
import toast from "react-hot-toast";

const useShopList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [categories, setCategories] = useState<{ name: string }[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [sortOption, setSortOption] = useState("az");
  const [isLoading, setIsLoading] = useState(false);

  const hasMore = visibleCount < products.length;
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchWishList = async () => {
      try{
        const wishlistProducts = await getWishlist();
        const ids = wishlistProducts.map((p:any) => p.id);
        setWishlistIds(ids);
      } catch (error){
        console.error("Error loading wishlist", error);
        //toast.error("Error loading wishlist");
      }
    };

    fetchWishList();
  }, []);

  const inWishlist = (productId: number) => {
    return wishlistIds.includes(productId);
  }

  const ToggleWishlist = async (productId: number) =>{
    if(!userId) return;

    if(inWishlist(productId)){
      const remove = await removeFromWishlist(productId);
      setWishlistIds(p => p.filter(id => id !== productId));
      console.log(remove);
      //toast("Product removed from wishlist!");
    } else {
      const add = await addToWishlist(userId, productId);
      setWishlistIds(p => [...p, productId]);
      console.log(add); 
      //toast("Product added to wishlist!");
    }
  }

  useEffect(() => {
    const loadData = async () => {
      const prods = await getProducts();
      if (Array.isArray(prods)) {
        setProducts(prods);
      } else {
        console.error("Expected an array of products but got:", prods);
      }
      const cats = await getCategories();
      if (!Array.isArray(cats)) {
        console.error("Expected an array of categories but got:", cats);
      }
      //setProducts(prods);
      setCategories(cats);
    };
    loadData();
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const sortedFilteredProducts = products
    .filter(
      (product) =>
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category)
    )
    .sort((a, b) => {
      switch (sortOption) {
        case "az":
          return a.title.localeCompare(b.title);
        case "za":
          return b.title.localeCompare(a.title);
        case "priceAsc":
          return a.price - b.price;
        case "priceDesc":
          return b.price - a.price;
        default:
          return 0;
      }
    })
    .slice(0, visibleCount);

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
    categories,
    sortOption,
    isLoading,
    sortedFilteredProducts,
    hasMore,
    wishlistIds,
    selectedCategories,
    setSortOption,
    handleCategoryChange,
    ToggleWishlist
  };
};

export default useShopList;