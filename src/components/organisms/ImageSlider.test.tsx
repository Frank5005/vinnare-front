import { render, screen, fireEvent } from '@testing-library/react';
import ImageSlider from './ImageSlider';
import React from 'react';

describe('ImageSlider', () => {
    const mockImages = [
        'image1.jpg',
        'image2.jpg',
        'image3.jpg'
    ];

    it('renders the first image initially', () => {
        render(<ImageSlider images={mockImages} />);
        const image = screen.getByAltText('slide-0');
        expect(image).toHaveAttribute('src', 'image1.jpg');
    });

    it('navigates to next image when next button is clicked', () => {
        render(<ImageSlider images={mockImages} />);
        const nextButton = screen.getByLabelText('Next slide');
        fireEvent.click(nextButton);
        const image = screen.getByAltText('slide-1');
        expect(image).toHaveAttribute('src', 'image2.jpg');
    });

    it('navigates to previous image when prev button is clicked', () => {
        render(<ImageSlider images={mockImages} />);
        const prevButton = screen.getByLabelText('Previous slide');
        fireEvent.click(prevButton);
        const image = screen.getByAltText('slide-2');
        expect(image).toHaveAttribute('src', 'image3.jpg');
    });

    it('shows correct number of navigation dots', () => {
        render(<ImageSlider images={mockImages} />);
        const dots = screen.getAllByTestId('navigation-dot');
        expect(dots).toHaveLength(mockImages.length);
    });

    it('highlights the current slide dot', () => {
        render(<ImageSlider images={mockImages} />);
        const dots = screen.getAllByTestId('navigation-dot');
        expect(dots[0]).toHaveClass('bg-black');
        expect(dots[1]).toHaveClass('bg-gray-300');
        expect(dots[2]).toHaveClass('bg-gray-300');
    });

    it('applies custom className when provided', () => {
        const customClass = 'custom-class';
        render(<ImageSlider images={mockImages} className={customClass} />);
        const slider = screen.getByTestId('image-slider');
        expect(slider).toHaveClass(customClass);
    });

    it('cycles through images correctly', () => {
        render(<ImageSlider images={mockImages} />);
        const nextButton = screen.getByLabelText('Next slide');
        
        fireEvent.click(nextButton);
        fireEvent.click(nextButton);
        expect(screen.getByAltText('slide-2')).toHaveAttribute('src', 'image3.jpg');
        
        fireEvent.click(nextButton);
        expect(screen.getByAltText('slide-0')).toHaveAttribute('src', 'image1.jpg');
        
        const prevButton = screen.getByLabelText('Previous slide');
        fireEvent.click(prevButton);
        expect(screen.getByAltText('slide-2')).toHaveAttribute('src', 'image3.jpg');
    });
});
