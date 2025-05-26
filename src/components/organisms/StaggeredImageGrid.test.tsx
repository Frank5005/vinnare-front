import { render, screen } from '@testing-library/react';
import StaggeredImageGrid from './StaggeredImageGrid';
import React from 'react';

describe('StaggeredImageGrid', () => {
    const mockImages = [
        'image1.jpg',
        'image2.jpg',
        'image3.jpg'
    ];

    const mockAltTexts = [
        'Left image',
        'Center image',
        'Right image'
    ];

    it('renders all three images correctly', () => {
        render(<StaggeredImageGrid images={mockImages} />);
        
        const images = screen.getAllByRole('img');
        expect(images).toHaveLength(3);
        
        images.forEach((img, index) => {
            expect(img).toHaveAttribute('src', mockImages[index]);
        });
    });

    it('uses provided alt texts when available', () => {
        render(<StaggeredImageGrid images={mockImages} altTexts={mockAltTexts} />);
        
        const images = screen.getAllByRole('img');
        images.forEach((img, index) => {
            expect(img).toHaveAttribute('alt', mockAltTexts[index]);
        });
    });

    it('uses default alt texts when not provided', () => {
        render(<StaggeredImageGrid images={mockImages} />);
        
        const images = screen.getAllByRole('img');
        expect(images[0]).toHaveAttribute('alt', 'left');
        expect(images[1]).toHaveAttribute('alt', 'center');
        expect(images[2]).toHaveAttribute('alt', 'right');
    });

    it('renders with correct grid structure and classes', () => {
        const { container } = render(<StaggeredImageGrid images={mockImages} />);
        
        const mainContainer = container.firstChild;
        expect(mainContainer).toHaveClass('flex', 'justify-center', 'items-end', 'gap-6', 'w-full', 'py-8');

        const imageContainers = container.querySelectorAll('.w-48.h-64, .w-48.h-80');
        expect(imageContainers).toHaveLength(3);

        expect(imageContainers[1]).toHaveClass('-mb-8');

        imageContainers.forEach(container => {
            expect(container).toHaveClass('w-48', 'bg-gray-300', 'rounded-md', 'overflow-hidden', 'flex', 'items-center', 'justify-center');
        });

        expect(imageContainers[0]).toHaveClass('h-64');
        expect(imageContainers[1]).toHaveClass('h-80');
        expect(imageContainers[2]).toHaveClass('h-64');
    });
});
