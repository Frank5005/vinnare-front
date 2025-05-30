import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CartSummary from '../../components/molecules/CartSummary';
import { BrowserRouter } from 'react-router-dom';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const fullPreview = {
  user_id: 'user123',
  user_name: 'John Doe',
  shopping_cart: [1, 2, 3],
  coupon_applied: 'SAVE10',
  total_before_discount: 100,
  total_after_discount: 80,
  shipping_cost: 5,
  final_total: 85,
  address: '123 Main St, City, Country',
  payment_status: 'pending',
  status: 'in_cart',
};

describe('CartSummary component', () => {
  const defaultProps = {
    subtotal: 100,
    discountedTotal: 80,
    couponCode: '',
    discount: 20,
    appliedCouponCode: '',
    readOnly: false,
    preview: fullPreview,
    handleApplyCoupon: jest.fn(),
    setCouponCode: jest.fn(),
  };

  const renderComponent = (props = defaultProps) =>
    render(
      <BrowserRouter>
        <CartSummary {...props} />
      </BrowserRouter>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders subtotal and discount correctly', () => {
    renderComponent();
    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    expect(screen.getByText('$100.00')).toBeInTheDocument();
    expect(screen.getByText('Discount (20%)')).toBeInTheDocument();
    expect(screen.getByText('- $20.00')).toBeInTheDocument();
  });

  it('shows coupon input and updates value', () => {
    renderComponent({ ...defaultProps, couponCode: 'SAVE10' });
    const input = screen.getByPlaceholderText('Enter coupon code here') as HTMLInputElement;
    expect(input.value).toBe('SAVE10');
  });

  it('calls setCouponCode on input change', () => {
    renderComponent();
    const input = screen.getByPlaceholderText('Enter coupon code here');
    fireEvent.change(input, { target: { value: 'NEWCODE' } });
    expect(defaultProps.setCouponCode).toHaveBeenCalledWith('NEWCODE');
  });

  it('calls handleApplyCoupon on keydown', () => {
    renderComponent();
    const input = screen.getByPlaceholderText('Enter coupon code here');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(defaultProps.handleApplyCoupon).toHaveBeenCalled();
  });

  it('renders continue button and navigates on click', () => {
    renderComponent();
    const button = screen.getByRole('button', { name: /continue to checkout/i });
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith('/checkout-address');
  });

  it('renders readOnly summary correctly', () => {
    renderComponent({
      ...defaultProps,
      readOnly: true,
      appliedCouponCode: 'SAVE10',
    });

    expect(screen.getByText('Applied coupon:')).toBeInTheDocument();
    expect(screen.getByText('SAVE10')).toBeInTheDocument();
    expect(screen.getByText('Shipping')).toBeInTheDocument();
    expect(screen.getByText('$5.00')).toBeInTheDocument();
    expect(screen.getByText('$85.00')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Enter coupon code here')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
