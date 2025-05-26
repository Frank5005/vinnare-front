import { render, screen } from '@testing-library/react';
import CategoryGrid from './CategoryGrid';
import React from 'react';

describe('CategoryGrid', () => {
    const mockCategories = [
        { name: 'Electronics', image: 'electronics.jpg' },
        { name: 'Clothing', image: 'clothing.jpg' },
        { name: 'Books', image: 'books.jpg' }
    ];

    it('renders all category cards', () => {
        render(<CategoryGrid categories={mockCategories} />);
        
        mockCategories.forEach(category => {
            expect(screen.getByText(category.name)).toBeInTheDocument();
            expect(screen.getByAltText(category.name)).toHaveAttribute('src', category.image);
        });
    });

    it('renders with correct grid structure and classes', () => {
        const { container } = render(<CategoryGrid categories={mockCategories} />);
        
        // Check main container
        const mainContainer = container.firstChild;
        expect(mainContainer).toHaveClass('w-full', 'flex', 'justify-center');

        // Check grid container
        const gridContainer = container.querySelector('.grid');
        expect(gridContainer).toHaveClass('grid', 'grid-cols-1', 'sm:grid-cols-2', 'md:grid-cols-3', 'gap-8');

        // Check number of category cards
        const categoryCards = container.querySelectorAll('.flex.flex-col.items-center');
        expect(categoryCards).toHaveLength(mockCategories.length);
    });

    it('renders empty grid when no categories are provided', () => {
        const { container } = render(<CategoryGrid categories={[]} />);
        
        const gridContainer = container.querySelector('.grid');
        expect(gridContainer).toBeInTheDocument();
        expect(gridContainer?.children).toHaveLength(0);
    });

    it('renders category cards with correct image and name', () => {
        render(<CategoryGrid categories={mockCategories} />);
        
        mockCategories.forEach(category => {
            const card = screen.getByText(category.name).closest('.flex.flex-col.items-center');
            expect(card).toBeInTheDocument();
            
            const image = card?.querySelector('img');
            expect(image).toHaveAttribute('src', category.image);
            expect(image).toHaveAttribute('alt', category.name);
            expect(image).toHaveClass('object-cover', 'w-full', 'h-full');
        });
    });
});
