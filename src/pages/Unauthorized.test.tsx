import React from 'react';
import { render, screen } from '@testing-library/react';
import Unauthorized from './Unauthorized';

describe('Unauthorized', () => {
  beforeEach(() => {
    render(<Unauthorized />);
  });

  it('renders the main heading with correct text and styling', () => {
    const heading = screen.getByText('Not found');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('text-6xl', 'font-bold', 'text-red-600', 'mb-4');
  });

  it('renders the main message with correct text and styling', () => {
    const mainMessage = screen.getByText(
      'What you were looking for was not found or you do not have permission to access.'
    );
    expect(mainMessage).toBeInTheDocument();
    expect(mainMessage).toHaveClass('text-2xl', 'text-gray-800', 'mb-2');
  });

  it('renders the secondary message with correct text and styling', () => {
    const secondaryMessage = screen.getByText(
      'Please check the URL or contact the administrator.'
    );
    expect(secondaryMessage).toBeInTheDocument();
    expect(secondaryMessage).toHaveClass('text-lg', 'text-gray-500');
  });

  it('renders the container with correct styling', () => {
    const container = screen.getByTestId('unauthorized-container');
    expect(container).toHaveClass(
      'min-h-screen',
      'flex',
      'flex-col',
      'items-center',
      'justify-center',
      'bg-gray-100'
    );
  });

  it('maintains the correct component structure', () => {
    const container = screen.getByTestId('unauthorized-container');
    expect(container).toHaveAttribute('class', expect.stringContaining('min-h-screen'));
    expect(container.children.length).toBe(3); // h1 and two p elements
  });
});
