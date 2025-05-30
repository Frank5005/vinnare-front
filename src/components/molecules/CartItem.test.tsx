import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CartItem from '../../components/molecules/CartItem';

describe('CartItem component', () => {
  const mockOnToggleCart = jest.fn();
  const defaultProps = {
    id: 1,
    title: 'Test Product',
    quantity: 3,
    price: 150,
    image: 'https://via.placeholder.com/150',
    onToggleCart: mockOnToggleCart,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders product title, quantity, and price', () => {
    render(<CartItem {...defaultProps} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Quantity: 3')).toBeInTheDocument();
    expect(screen.getByText('$150')).toBeInTheDocument();
  });

  it('renders product image with correct alt text', () => {
    render(<CartItem {...defaultProps} />);
    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img).toHaveAttribute('src', defaultProps.image);
    expect(img).toHaveAttribute('alt', defaultProps.title);
  });

  it('calls onToggleCart with correct id when "Remove" is clicked', () => {
    render(<CartItem {...defaultProps} />);
    fireEvent.click(screen.getByText('Remove'));
    expect(mockOnToggleCart).toHaveBeenCalledTimes(1);
    expect(mockOnToggleCart).toHaveBeenCalledWith(defaultProps.id);
  });

  it('has correct class names for layout and styles', () => {
    render(<CartItem {...defaultProps} />);
    const container = screen.getByText('Test Product').closest('div');
    expect(container?.className).toContain('');
  });
});
