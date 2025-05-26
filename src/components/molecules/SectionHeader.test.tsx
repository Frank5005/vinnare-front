import { render, screen, fireEvent } from '@testing-library/react';
import SectionHeader from './SectionHeader';
import React from 'react';

describe('SectionHeader', () => {
    it('renders title correctly', () => {
        const title = 'Test Title';
        render(<SectionHeader title={title} />);
        expect(screen.getByText(title)).toBeInTheDocument();
    });

    it('renders description when provided', () => {
        const description = 'Test Description';
        render(<SectionHeader title="Test" description={description} />);
        expect(screen.getByText(description)).toBeInTheDocument();
    });

    it('does not render description when not provided', () => {
        render(<SectionHeader title="Test" />);
        expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
    });

    it('renders button when buttonText is provided', () => {
        const buttonText = 'Click Me';
        render(<SectionHeader title="Test" buttonText={buttonText} />);
        expect(screen.getByText(buttonText)).toBeInTheDocument();
    });

    it('does not render button when buttonText is not provided', () => {
        render(<SectionHeader title="Test" />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('calls onButtonClick when button is clicked', () => {
        const buttonText = 'Click Me';
        const handleClick = jest.fn();
        render(
            <SectionHeader 
                title="Test" 
                buttonText={buttonText} 
                onButtonClick={handleClick}
            />
        );
        
        fireEvent.click(screen.getByText(buttonText));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('renders all elements correctly when all props are provided', () => {
        const title = 'Test Title';
        const description = 'Test Description';
        const buttonText = 'Click Me';
        const handleClick = jest.fn();

        render(
            <SectionHeader 
                title={title}
                description={description}
                buttonText={buttonText}
                onButtonClick={handleClick}
            />
        );

        expect(screen.getByText(title)).toBeInTheDocument();
        expect(screen.getByText(description)).toBeInTheDocument();
        expect(screen.getByText(buttonText)).toBeInTheDocument();
    });
});
