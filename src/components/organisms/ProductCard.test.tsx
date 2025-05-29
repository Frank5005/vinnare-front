import { render, screen } from '@testing-library/react';
import ProductCard from './ProductCard';
import React from 'react';

describe('ProductCard', () => {
  const mockProps = {
    image: 'https://example.com/product-image.jpg',
    name: 'Test Product',
    price: 99.99
  };

  it('renders with correct image, name and price', () => {
    render(<ProductCard {...mockProps} />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', mockProps.image);
    expect(image).toHaveAttribute('alt', mockProps.name);
    
    expect(screen.getByText(mockProps.name)).toBeInTheDocument();
    expect(screen.getByText(`$${mockProps.price}`)).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    render(<ProductCard {...mockProps} />);
    
    const container = screen.getByText(mockProps.name).parentElement;
    expect(container).toHaveClass('flex', 'flex-col', 'items-start', 'w-40', 'md:w-60');
    
    const imageContainer = screen.getByRole('img').parentElement;
    expect(imageContainer).toHaveClass(
      'w-full',
      'h-40',
      'md:h-56',
      'bg-gray-300',
      'rounded-md',
      'overflow-hidden',
      'flex',
      'items-center',
      'justify-center'
    );
    
    const image = screen.getByRole('img');
    expect(image).toHaveClass('object-cover', 'w-full', 'h-full');
    
    const nameText = screen.getByText(mockProps.name);
    expect(nameText).toHaveClass('mt-2', 'font-semibold');
    
    const priceText = screen.getByText(`$${mockProps.price}`);
    expect(priceText).toHaveClass('text-sm');
  });

  it('handles different product names', () => {
    const differentName = 'Different Product';
    render(<ProductCard {...mockProps} name={differentName} />);
    
    expect(screen.getByText(differentName)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('alt', differentName);
  });

  it('handles different image URLs', () => {
    const differentImage = 'https://example.com/different-image.jpg';
    render(<ProductCard {...mockProps} image={differentImage} />);
    
    expect(screen.getByRole('img')).toHaveAttribute('src', differentImage);
  });

  it('handles different price formats', () => {
    const priceAsString = '99.99';
    render(<ProductCard {...mockProps} price={priceAsString} />);
    
    expect(screen.getByText(`$${priceAsString}`)).toBeInTheDocument();
  });

  it('handles integer prices', () => {
    const integerPrice = 100;
    render(<ProductCard {...mockProps} price={integerPrice} />);
    
    expect(screen.getByText(`$${integerPrice}`)).toBeInTheDocument();
  });
});
