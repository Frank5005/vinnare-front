import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CheckboxField from './CheckboxField';

describe('CheckboxField', () => {
  it('renders with label', () => {
    render(<CheckboxField label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders with error message', () => {
    render(<CheckboxField label="Test Label" error="Error message" />);
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('handles checked state', () => {
    render(<CheckboxField label="Test Label" />);
    const checkbox = screen.getByRole('checkbox');
    
    // Initially unchecked
    expect(checkbox).not.toBeChecked();
    
    // Check the checkbox
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    
    // Uncheck the checkbox
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<CheckboxField label="Test Label" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('applies custom props', () => {
    render(
      <CheckboxField 
        label="Test Label" 
        data-testid="custom-checkbox"
        disabled
        name="test-checkbox"
      />
    );
    
    const checkbox = screen.getByTestId('custom-checkbox');
    expect(checkbox).toBeDisabled();
    expect(checkbox).toHaveAttribute('name', 'test-checkbox');
  });

  it('applies correct styling classes', () => {
    render(<CheckboxField label="Test Label" />);
    
    // Check container classes
    const container = screen.getByText('Test Label').closest('div');
    expect(container).toHaveClass('space-y-1');
    
    // Check label classes
    const label = screen.getByText('Test Label');
    expect(label).toHaveClass('flex', 'items-center', 'gap-2', 'text-sm', 'text-gray-700', 'relative');
    
    // Check checkbox classes
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass(
      'peer',
      'h-4',
      'w-4',
      'appearance-none',
      'border',
      'border-gray-400',
      'rounded-sm',
      'checked:bg-black',
      'checked:border-black',
      'focus:ring-0'
    );
  });
});
