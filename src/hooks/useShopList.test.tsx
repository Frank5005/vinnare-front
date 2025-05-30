import { renderHook, act } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import useShopList from '../hooks/useShopList';
import * as service from '../services/shopperService';

jest.mock('../services/shopperService');

describe('useShopList', () => {
  const mockProducts = [
    {
      id: 1,
      title: 'Apple',
      price: 10,
      description: '',
      category: 'Fruit',
      image: '',
      rate: 0,
      quantity: 10,
      available: 10,
      owner: 'A',
      categoryId: 1,
    },
    {
      id: 2,
      title: 'Banana',
      price: 5,
      description: '',
      category: 'Fruit',
      image: '',
      rate: 0,
      quantity: 10,
      available: 10,
      owner: 'B',
      categoryId: 1,
    },
    {
      id: 3,
      title: 'Book',
      price: 20,
      description: '',
      category: 'Books',
      image: '',
      rate: 0,
      quantity: 10,
      available: 10,
      owner: 'C',
      categoryId: 2,
    },
  ];

  const mockCategories = [{ name: 'Fruit' }, { name: 'Books' }];
  const mockWishlist = [{ id: 3 }];

  beforeEach(() => {
    localStorage.setItem('userId', 'user123');

    (service.getProducts as jest.Mock).mockResolvedValue(mockProducts);
    (service.getCategories as jest.Mock).mockResolvedValue(mockCategories);
    (service.getWishlist as jest.Mock).mockResolvedValue(mockWishlist);
    (service.addToWishlist as jest.Mock).mockResolvedValue({ success: true });
    (service.removeFromWishlist as jest.Mock).mockResolvedValue({ success: true });
  });

  it('correctly load products, categories and wishlist', async () => {
    const { result } = renderHook(() => useShopList());

    await waitFor(() => {
      expect(result.current.sortedFilteredProducts.length).toBeGreaterThan(0);
    });

    expect(result.current.categories).toEqual(mockCategories);
    expect(result.current.wishlistIds).toEqual([3]);
  });

  it('filter products according to the selected category', async () => {
    const { result } = renderHook(() => useShopList());

    await waitFor(() => {
      expect(result.current.sortedFilteredProducts.length).toBe(3);
    });

    act(() => {
      result.current.handleCategoryChange('Books');
    });

    await waitFor(() => {
      expect(result.current.selectedCategories).toContain('Books');
      expect(result.current.sortedFilteredProducts.length).toBe(1);
    });
  });

  it('sort products by ascending title', async () => {
    const { result } = renderHook(() => useShopList());

    await waitFor(() => {
      expect(result.current.sortedFilteredProducts.length).toBe(3);
    });

    act(() => {
      result.current.setSortOption('az');
    });

    const titles = result.current.sortedFilteredProducts.map((p) => p.title);
    expect(titles).toEqual(['Apple', 'Banana', 'Book']);
  });

  it('add and remove products from the wishlist', async () => {
    const { result } = renderHook(() => useShopList());

    await waitFor(() => {
      expect(result.current.wishlistIds).toContain(3);
    });

    await act(async () => {
      await result.current.ToggleWishlist(2);
    });
    expect(service.addToWishlist).toHaveBeenCalledWith('user123', 2);
    expect(result.current.wishlistIds).toContain(2);

    await act(async () => {
      await result.current.ToggleWishlist(3);
    });
    expect(service.removeFromWishlist).toHaveBeenCalledWith(3);
    expect(result.current.wishlistIds).not.toContain(3);
  });
});
