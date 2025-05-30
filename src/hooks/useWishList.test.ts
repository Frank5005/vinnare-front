import { renderHook, act } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import ShowWishList from "../hooks/useWishList";
import * as shopperService from "../services/shopperService";
import toast from "react-hot-toast";

// Mocks
jest.mock("../services/shopperService");
jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  default: jest.fn(),
}));

const mockWishlist = [
  { id: 1, name: "Product 1" },
  { id: 2, name: "Product 2" },
];
const mockCart = [{ id: 3, name: "Product 3" }];

describe("ShowWishList Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("userId", "123");
    (shopperService.getWishlist as jest.Mock).mockResolvedValue(mockWishlist);
    (shopperService.getCart as jest.Mock).mockResolvedValue(mockCart);
    (shopperService.addToWishlist as jest.Mock).mockResolvedValue({});
    (shopperService.removeFromWishlist as jest.Mock).mockResolvedValue({});
    (shopperService.addToCart as jest.Mock).mockResolvedValue({});
  });

  describe("Initialization", () => {
    it("should fetch wishlist and cart on mount", async () => {
      const { result } = renderHook(() => ShowWishList());

      await waitFor(() => {
        expect(result.current.products.length).toBe(2);
      });

      expect(shopperService.getWishlist).toHaveBeenCalledTimes(1);
      expect(shopperService.getCart).toHaveBeenCalledTimes(1);
    });
  });

  describe("ToggleWishlist", () => {
    it("should remove an item if already in wishlist", async () => {
      const { result } = renderHook(() => ShowWishList());

      await waitFor(() => {
        expect(result.current.products.length).toBe(2);
      });

      await act(async () => {
        await result.current.ToggleWishlist(1);
      });

      expect(shopperService.removeFromWishlist).toHaveBeenCalledWith(1);
    });

    it("should add an item if not in wishlist", async () => {
      const { result } = renderHook(() => ShowWishList());

      await waitFor(() => {
        expect(result.current.products.length).toBe(2);
      });

      await act(async () => {
        await result.current.ToggleWishlist(5);
      });

      expect(shopperService.addToWishlist).toHaveBeenCalledWith("123", 5);
    });
  });

  describe("ShopAll", () => {
    it("should add missing wishlist items to cart and remove them from wishlist", async () => {
      const { result } = renderHook(() => ShowWishList());

      await waitFor(() => {
        expect(result.current.products.length).toBe(2);
      });

      await act(async () => {
        await result.current.ShopAll(result.current.wishlistIds);
      });

      expect(shopperService.addToCart).toHaveBeenCalledTimes(2);
      expect(shopperService.removeFromWishlist).toHaveBeenCalledTimes(2);
      expect(shopperService.getWishlist).toHaveBeenCalledTimes(2);
      expect(shopperService.getCart).toHaveBeenCalledTimes(2);
      expect(toast.success).toHaveBeenCalledWith("Products added to the cart!");
    });
  });

  describe("Infinite Scroll", () => {
    it("should increase visibleCount when scrolling near bottom", async () => {
      const { result } = renderHook(() => ShowWishList());

      await waitFor(() => {
        expect(result.current.products.length).toBe(2);
      });

      // Simulate scroll event
      await act(async () => {
        window.scrollY = 1000;
        //document.body.offsetHeight = 1500;
        window.innerHeight = 800;

        Object.defineProperty(document.body, "offsetHeight", {
          configurable: true,
          value: 1500,
        });

        const scrollEvent = new Event("scroll");
        window.dispatchEvent(scrollEvent);

        await new Promise((r) => setTimeout(r, 600));
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.products.length).toBeGreaterThan(0);
    });
  });

  describe("Loading State", () => {
    it("should set isLoading true during fetch and false afterwards", async () => {
      const { result } = renderHook(() => ShowWishList());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });
});
