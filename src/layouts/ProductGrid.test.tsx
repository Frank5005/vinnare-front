import { render, screen } from '@testing-library/react';
import ProductGrid from './ProductGrid';
import React from 'react';

describe('ProductGrid', () => {
    const mockProducts = [
        { name: 'Laptop', price: 999.99, image: 'laptop.jpg' },
        { name: 'Smartphone', price: 499.99, image: 'smartphone.jpg' },
        { name: 'Headphones', price: 199.99, image: 'headphones.jpg' }
    ];

    it('renders all product cards', () => {
        render(<ProductGrid products={mockProducts} />);
        
        mockProducts.forEach(product => {
            expect(screen.getByText(product.name)).toBeInTheDocument();
            expect(screen.getByText(`$${product.price}`)).toBeInTheDocument();
            expect(screen.getByAltText(product.name)).toHaveAttribute('src', product.image);
        });
    });

    it('renders with correct grid structure and classes', () => {
        const { container } = render(<ProductGrid products={mockProducts} />);
        
        const mainContainer = container.firstChild;
        expect(mainContainer).toHaveClass('w-full', 'flex', 'justify-center');

        const gridContainer = container.querySelector('.grid');
        expect(gridContainer).toHaveClass('grid', 'grid-cols-1', 'sm:grid-cols-2', 'md:grid-cols-3', 'gap-8');

        const productCards = container.querySelectorAll('.flex.flex-col.items-start');
        expect(productCards).toHaveLength(mockProducts.length);
    });

    it('renders empty grid when no products are provided', () => {
        const { container } = render(<ProductGrid products={[]} />);
        
        const gridContainer = container.querySelector('.grid');
        expect(gridContainer).toBeInTheDocument();
        expect(gridContainer?.children).toHaveLength(0);
    });

    it('renders product cards with correct image, name and price', () => {
        render(<ProductGrid products={mockProducts} />);
        
        mockProducts.forEach(product => {
            const card = screen.getByText(product.name).closest('.flex.flex-col.items-start');
            expect(card).toBeInTheDocument();
            
            const image = card?.querySelector('img');
            expect(image).toHaveAttribute('src', product.image);
            expect(image).toHaveAttribute('alt', product.name);
            expect(image).toHaveClass('object-cover', 'w-full', 'h-full');

            const price = card?.querySelector('.text-sm');
            expect(price).toHaveTextContent(`$${product.price}`);
        });
    });

    it('handles different price formats (string and number)', () => {
        const productsWithMixedPrices = [
            { name: 'Product 1', price: 100, image: 'product1.jpg' },
            { name: 'Product 2', price: '200', image: 'product2.jpg' }
        ];

        render(<ProductGrid products={productsWithMixedPrices} />);
        
        expect(screen.getByText('$100')).toBeInTheDocument();
        expect(screen.getByText('$200')).toBeInTheDocument();
    });
});
