import {
  getProducts,
  getProductById,
  getCategories,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getWishlistItemId,
  getCart,
  addToCart,
  removeFromCart,
  useCoupon,
  viewPreview,
  buyProducts
} from './shopperService';
import api from './api';

jest.mock('./api');

describe('shopperService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('should fetch and transform products successfully', async () => {
      const mockProducts = [{
        id: 1,
        title: 'Product 1',
        price: 100,
        description: 'Description 1',
        category: 'Category 1',
        image: 'image1.jpg',
        rate: 4.5,
        quantity: 10,
        available: true
      }];

      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockProducts });

      const result = await getProducts();

      expect(api.get).toHaveBeenCalledWith('/api/product/store', { withCredentials: false });
      expect(result).toEqual([{
        id: 1,
        title: 'Product 1',
        price: 100,
        description: 'Description 1',
        category: 'Category 1',
        imageUrl: 'image1.jpg',
        rate: 4.5,
        quantity: 10,
        available: true
      }]);
    });

    it('should handle errors when fetching products', async () => {
      const mockError = new Error('Failed to fetch products');
      (api.get as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(getProducts()).rejects.toThrow('Failed to fetch products');
    });
  });

  describe('getProductById', () => {
    it('should fetch a single product successfully', async () => {
      const mockProduct = { id: 1, title: 'Product 1' };
      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockProduct });

      const result = await getProductById(1);

      expect(api.get).toHaveBeenCalledWith('/api/product/1');
      expect(result).toEqual(mockProduct);
    });

    it('should handle errors when fetching a product', async () => {
      const mockError = new Error('Failed to fetch product');
      (api.get as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(getProductById(1)).rejects.toThrow('Failed to fetch product');
    });
  });

  describe('getCategories', () => {
    it('should fetch and transform categories successfully', async () => {
      const mockCategories = [
        { name: 'Category 1' },
        { name: 'Category 2' }
      ];

      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockCategories });

      const result = await getCategories();

      expect(api.get).toHaveBeenCalledWith('/api/category/store');
      expect(result).toEqual([
        { name: 'Category 1' },
        { name: 'Category 2' }
      ]);
    });

    it('should handle errors when fetching categories', async () => {
      const mockError = new Error('Failed to fetch categories');
      (api.get as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(getCategories()).rejects.toThrow('Failed to fetch categories');
    });
  });

  describe('Wishlist operations', () => {
    describe('getWishlist', () => {
      it('should fetch wishlist successfully', async () => {
        const mockWishlist = [{ id: 1, productId: 1 }];
        (api.get as jest.Mock).mockResolvedValueOnce({ data: mockWishlist });

        const result = await getWishlist();

        expect(api.get).toHaveBeenCalledWith('/api/user/wishlist');
        expect(result).toEqual(mockWishlist);
      });
    });

    describe('addToWishlist', () => {
      it('should add item to wishlist successfully', async () => {
        const mockResponse = { success: true };
        (api.post as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

        const result = await addToWishlist('user123', 1);

        expect(api.post).toHaveBeenCalledWith('/api/user/wishlist/add', {
          product_id: 1,
          user_id: 'user123'
        });
        expect(result).toEqual(mockResponse);
      });
    });

    describe('removeFromWishlist', () => {
      it('should remove item from wishlist successfully', async () => {
        const mockResponse = { success: true };
        (api.delete as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

        const result = await removeFromWishlist(1);

        expect(api.delete).toHaveBeenCalledWith('api/user/wishlist/1');
        expect(result).toEqual(mockResponse);
      });
    });

    describe('getWishlistItemId', () => {
      it('should get wishlist item id successfully', async () => {
        const mockResponse = { id: 1 };
        (api.get as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

        const result = await getWishlistItemId(1);

        expect(api.get).toHaveBeenCalledWith('api/user/wishlist/item', {
          params: { productId: 1 }
        });
        expect(result).toEqual(mockResponse);
      });
    });
  });

  describe('Cart operations', () => {
    describe('getCart', () => {
      it('should fetch and transform cart items successfully', async () => {
        const mockCart = [{
          productId: 1,
          title: 'Product 1',
          price: 100,
          description: 'Description 1',
          category: 'Category 1',
          image: 'image1.jpg',
          quantity: 2,
          available: true,
          categoryId: 1
        }];

        (api.get as jest.Mock).mockResolvedValueOnce({ data: mockCart });

        const result = await getCart();

        expect(api.get).toHaveBeenCalledWith('/api/cart/full');
        expect(result).toEqual([{
          id: 1,
          title: 'Product 1',
          price: 100,
          description: 'Description 1',
          category: 'Category 1',
          image: 'image1.jpg',
          quantity: 2,
          available: true,
          categoryId: 1
        }]);
      });
    });

    describe('addToCart', () => {
      it('should add item to cart successfully', async () => {
        const mockResponse = { success: true };
        (api.post as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

        const result = await addToCart(1, 2);

        expect(api.post).toHaveBeenCalledWith('/api/cart', {
          productId: 1,
          quantity: 2
        });
        expect(result).toEqual(mockResponse);
      });
    });

    describe('removeFromCart', () => {
      it('should remove item from cart successfully', async () => {
        const mockResponse = { success: true };
        (api.delete as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

        const result = await removeFromCart(1);

        expect(api.delete).toHaveBeenCalledWith('api/cart/1');
        expect(result).toEqual(mockResponse);
      });
    });
  });

  describe('Purchase operations', () => {
    describe('useCoupon', () => {
      it('should apply coupon successfully', async () => {
        const mockResponse = { discount: 10 };
        (api.get as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

        const result = await useCoupon('DISCOUNT10');

        expect(api.get).toHaveBeenCalledWith('/api/coupons/use', {
          params: { code: 'DISCOUNT10' }
        });
        expect(result).toEqual(mockResponse);
      });
    });

    describe('viewPreview', () => {
      it('should get purchase preview successfully', async () => {
        const mockResponse = { total: 100, discount: 10 };
        (api.post as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

        const result = await viewPreview({ coupon_code: 'DISCOUNT10' });

        expect(api.post).toHaveBeenCalledWith('/api/purchases/preview', {
          coupon_code: 'DISCOUNT10'
        });
        expect(result).toEqual(mockResponse);
      });
    });

    describe('buyProducts', () => {
      it('should complete purchase successfully', async () => {
        const mockResponse = { orderId: '123', total: 100 };
        (api.post as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

        const result = await buyProducts({ coupon_code: 'DISCOUNT10' });

        expect(api.post).toHaveBeenCalledWith('/api/purchases', {
          coupon_code: 'DISCOUNT10'
        });
        expect(result).toEqual(mockResponse);
      });
    });
  });
});
