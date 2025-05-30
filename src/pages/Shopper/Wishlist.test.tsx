import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Wishlist from './Wishlist';
import ShowWishList from '../../hooks/useWishList';

// Mock components
jest.mock('../../components/organisms/Header', () => () => <div>Mock Header</div>);
jest.mock('../../components/organisms/Footer', () => () => <div>Mock Footer</div>);
jest.mock('../../components/organisms/ProductComponent', () => ({ name }: any) => <div>{name}</div>);

// Mock hook
jest.mock('../../hooks/useWishList');

const mockProducts = [
  { id: 1, title: 'Product 1', image: '/image1.jpg' },
  { id: 2, title: 'Product 2', image: '/image2.jpg' }
];

describe('Wishlist Page', () => {
  it('renders header, footer and title', () => {
    (ShowWishList as jest.Mock).mockReturnValue({
      products: [],
      isLoading: false,
      hasMore: false,
      wishlistIds: [],
      ToggleWishlist: jest.fn(),
      ShopAll: jest.fn(),
    });

    render(<Wishlist />);

    expect(screen.getByText('Mock Header')).toBeInTheDocument();
    expect(screen.getByText('Mock Footer')).toBeInTheDocument();
    expect(screen.getByText('Wish List')).toBeInTheDocument();
    expect(screen.getByText(/This are the products that you liked it before/)).toBeInTheDocument();
  });

  it('renders products from wishlist', async () => {
    (ShowWishList as jest.Mock).mockReturnValue({
      products: mockProducts,
      isLoading: false,
      hasMore: false,
      wishlistIds: [1, 2],
      ToggleWishlist: jest.fn(),
      ShopAll: jest.fn(),
    });

    render(<Wishlist />);
    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
    });
  });

  it('renders "Shop All" button when wishlist is not empty', () => {
    const mockShopAll = jest.fn();

    (ShowWishList as jest.Mock).mockReturnValue({
      products: mockProducts,
      isLoading: false,
      hasMore: false,
      wishlistIds: [1, 2],
      ToggleWishlist: jest.fn(),
      ShopAll: mockShopAll,
    });

    render(<Wishlist />);
    const shopAllButton = screen.getByText('Shop All');
    expect(shopAllButton).toBeInTheDocument();

    fireEvent.click(shopAllButton);
    expect(mockShopAll).toHaveBeenCalledWith([1, 2]);
  });

  it('renders loading message when isLoading and hasMore are true', () => {
    (ShowWishList as jest.Mock).mockReturnValue({
      products: mockProducts,
      isLoading: true,
      hasMore: true,
      wishlistIds: [1, 2],
      ToggleWishlist: jest.fn(),
      ShopAll: jest.fn(),
    });

    render(<Wishlist />);
    expect(screen.getByText('Loading more products...')).toBeInTheDocument();
  });
});
