import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('renders the text correctly', () => {
    render(<Button>My Button</Button>);
    expect(screen.getByText('My Button')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const mockHandleClick = jest.fn(); // Mock event onClick
    render(<Button onClick={mockHandleClick}>Click here</Button>);
    fireEvent.click(screen.getByText('Click here'));
    expect(mockHandleClick).toHaveBeenCalledTimes(1);
  });

  it('applies the correct variant class', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByText('Secondary');
    expect(button).toHaveClass('bg-gray-200');
  });

  it('hover effect', () => {
    render(<Button>Hover</Button>);
    const button = screen.getByText('Hover');
    fireEvent.mouseEnter(button);
    expect(button).toHaveClass('hover:bg-gray-900');
  });
  
});
