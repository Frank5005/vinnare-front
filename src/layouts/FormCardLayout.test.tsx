import { render, screen } from '@testing-library/react';
import FormCardLayout from './FormCardLayout';
import React from 'react';

describe('FormCardLayout', () => {
  it('renders title and children', () => {
    render(
      <FormCardLayout title="Test Title">
        <div>Child Content</div>
      </FormCardLayout>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('renders welcome and subtitle if provided', () => {
    render(
      <FormCardLayout
        title="Title"
        welcome="Welcome!"
        subtitle="This is a subtitle"
      >
        <div>Child</div>
      </FormCardLayout>
    );
    expect(screen.getByText('Welcome!')).toBeInTheDocument();
    expect(screen.getByText('This is a subtitle')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <FormCardLayout title="Title" className="custom-class">
        <div>Child</div>
      </FormCardLayout>
    );
    const container = screen.getByText('Title').closest('div');
    expect(container).toHaveClass('custom-class');
  });
});