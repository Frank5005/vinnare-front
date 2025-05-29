import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterDropdown from './FilterDropdown';

describe('FilterDropdown', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with the correct label', () => {
    render(<FilterDropdown value="az" onChange={mockOnChange} />);
    expect(screen.getByText('Sort By')).toBeInTheDocument();
  });

  it('renders all sorting options', () => {
    render(<FilterDropdown value="az" onChange={mockOnChange} />);
    expect(screen.getByText('Alphabetical (A-Z)')).toBeInTheDocument();
    expect(screen.getByText('Alphabetical (Z-A)')).toBeInTheDocument();
    expect(screen.getByText('Price (Low to High)')).toBeInTheDocument();
    expect(screen.getByText('Price (High to Low)')).toBeInTheDocument();
  });

  it('displays the correct initial value', () => {
    render(<FilterDropdown value="priceAsc" onChange={mockOnChange} />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('priceAsc');
  });

  it('calls onChange when a new option is selected', () => {
    render(<FilterDropdown value="az" onChange={mockOnChange} />);
    const select = screen.getByRole('combobox');
    
    fireEvent.change(select, { target: { value: 'priceDesc' } });
    
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('priceDesc');
  });

  it('has the correct aria-label', () => {
    render(<FilterDropdown value="az" onChange={mockOnChange} />);
    expect(screen.getByLabelText('Sort By')).toBeInTheDocument();
  });
}); 