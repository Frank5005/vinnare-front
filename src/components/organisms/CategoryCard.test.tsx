import { render, screen } from '@testing-library/react';
import CategoryCard from './CategoryCard';
import React from 'react';

describe('CategoryCard', () => {
  const mockProps = {
    image: 'https://example.com/category-image.jpg',
    name: 'Test Category'
  };

  it('renders with correct image and name', () => {
    render(<CategoryCard {...mockProps} />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', mockProps.image);
    expect(image).toHaveAttribute('alt', mockProps.name);

    expect(screen.getByText(mockProps.name)).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    render(<CategoryCard {...mockProps} />);
    
    const container = screen.getByText(mockProps.name).parentElement;
    expect(container).toHaveClass('flex', 'flex-col', 'items-center');
    
    const imageContainer = screen.getByRole('img').parentElement;
    expect(imageContainer).toHaveClass(
      'w-40',
      'h-40',
      'bg-gray-300',
      'rounded-md',
      'overflow-hidden',
      'flex',
      'items-center',
      'justify-center'
    );
    
    const image = screen.getByRole('img');
    expect(image).toHaveClass('object-cover', 'w-full', 'h-full');
    
    const text = screen.getByText(mockProps.name);
    expect(text).toHaveClass('mt-2', 'font-semibold');
  });

  it('handles different category names', () => {
    const differentName = 'Different Category';
    render(<CategoryCard {...mockProps} name={differentName} />);
    
    expect(screen.getByText(differentName)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('alt', differentName);
  });

  it('handles different image URLs', () => {
    const differentImage = 'https://example.com/different-image.jpg';
    render(<CategoryCard {...mockProps} image={differentImage} />);
    
    expect(screen.getByRole('img')).toHaveAttribute('src', differentImage);
  });
});
