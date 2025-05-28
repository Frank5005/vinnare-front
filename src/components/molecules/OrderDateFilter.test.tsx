import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OrderDateFilter from './OrderDateFilter';

describe('OrderDateFilter', () => {
  it('renders with initial value', () => {
    render(<OrderDateFilter value="7" onChange={() => {}} />);
    
    const select = screen.getByTitle(/Date filter/i);
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue("7");
  });

  it('calls onChange when a new option is selected', () => {
    const handleChange = jest.fn();
    render(<OrderDateFilter value="30" onChange={handleChange} />);

    const select = screen.getByTitle(/Date filter/i);
    fireEvent.change(select, { target: { value: "365" } });

    expect(handleChange).toHaveBeenCalledWith("365");
  });

  it('renders all options', () => {
    render(<OrderDateFilter value="all" onChange={() => {}} />);

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(4); // Verifica que haya 4 opciones
    expect(options[0]).toHaveTextContent("Last 7 Days");
    expect(options[1]).toHaveTextContent("Last 30 Days");
    expect(options[2]).toHaveTextContent("This Year");
    expect(options[3]).toHaveTextContent("All");
  });
});
