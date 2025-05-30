import React from 'react';
import { render, screen } from '@testing-library/react';
import Cart from '../../pages/Shopper/Cart';
import { useCart } from '../../hooks/useCart';

// Mocks
jest.mock('../../hooks/useCart');
jest.mock('../../components/molecules/CartItem', () => () => <div data-testid="cart-item">CartItem</div>);
jest.mock('../../components/molecules/CartInfo', () => () => <div data-testid="cart-info">CartInfo</div>);
jest.mock('../../components/molecules/CartSummary', () => () => <div data-testid="cart-summary">CartSummary</div>);
jest.mock('../../components/organisms/Header', () => () => <div data-testid="header">Header</div>);
jest.mock('../../components/organisms/Footer', () => () => <div data-testid="footer">Footer</div>);

describe('Cart Page', () => {
  const mockUseCart = useCart as jest.Mock;

  beforeEach(() => {
    mockUseCart.mockReturnValue({
      cartItems: [],
      loading: false,
      error: null,
      subtotal: 0,
      discountedTotal: 0,
      couponCode: '',
      discount: 0,
      appliedCouponCode: '',
      data: null,
      ToggleCart: jest.fn(),
      handleApplyCoupon: jest.fn(),
      setCouponCode: jest.fn(),
      fetchPreview: jest.fn(),
    });
  });

  it('renders the header and footer', () => {
    render(<Cart />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('shows loading state when loading is true', () => {
    mockUseCart.mockReturnValueOnce({ ...mockUseCart(), loading: true });
    render(<Cart />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error message when error exists', () => {
    mockUseCart.mockReturnValueOnce({ ...mockUseCart(), error: 'Failed to load' });
    render(<Cart />);
    expect(screen.getByText('Failed to load')).toBeInTheDocument();
  });

  it('renders cart items when they exist', () => {
    mockUseCart.mockReturnValueOnce({
      ...mockUseCart(),
      cartItems: [
        { id: 1, title: 'Product 1', quantity: 2, price: 100, image: 'img1.jpg' },
        { id: 2, title: 'Product 2', quantity: 1, price: 200, image: 'img2.jpg' },
      ],
    });
    render(<Cart />);
    const items = screen.getAllByTestId('cart-item');
    expect(items.length).toBe(2);
  });

  it('renders CartSummary when data is available', () => {
    mockUseCart.mockReturnValueOnce({
      ...mockUseCart(),
      data: { preview: true },
    });
    render(<Cart />);
    expect(screen.getByTestId('cart-summary')).toBeInTheDocument();
  });

  it('always renders CartInfo', () => {
    render(<Cart />);
    expect(screen.getByTestId('cart-info')).toBeInTheDocument();
  });
});
