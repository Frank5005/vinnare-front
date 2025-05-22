import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import SelectField from './SelectField';


describe('SelectField', () => {
  const options = [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
  ];

  it('renders the label correctly', () => {
    render(<SelectField label="Category" options={options} value="" />);
    expect(screen.getByText('Category')).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(<SelectField label="Category" options={options} value="" />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('shows the error message when error prop is provided', () => {
    render(<SelectField label="Category" options={options} error="Required" value="" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('calls onChange when an option is selected', () => {
    const handleChange = jest.fn();
    render(
      <SelectField
        label="Category"
        options={options}
        value=""
        onChange={handleChange}
      />
    );
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'opt2' } });
    expect(handleChange).toHaveBeenCalled();
  });
});