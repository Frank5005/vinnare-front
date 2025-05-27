import { render, screen, fireEvent } from '@testing-library/react';
import ProductsList from './ProductsList';
import React from 'react';

jest.mock('../../components/organisms/AdminHeader', () => () => <div data-testid="admin-header">Header</div>);

jest.mock('../../components/organisms/DataTable', () => {
  const actual = jest.requireActual('../../components/organisms/DataTable');
  return {
    ...actual,
    DataTable: actual.DataTable,
  };
});

jest.mock('../../components/molecules/OrderDateFilter', () => ({ value, onChange }: any) => (
  <select data-testid="order-date-filter" value={value} onChange={e => onChange(e.target.value)}>
    <option value="7">Last 7 Days</option>
    <option value="all">All</option>
  </select>
));

const mockProducts = [
  { id: 1, title: 'Product1', price: 10, quantity: 5, available: 5, ownerId: 1, category: 'Cat', image: '', approved: true, date: new Date().toISOString() },
  { id: 2, title: 'Product2', price: 20, quantity: 10, available: 10, ownerId: 2, category: 'Cat', image: '', approved: false, date: new Date().toISOString() }
];
let loading = false;
let error: string | null = null;
jest.mock('../../hooks/useAllProducts', () => ({
  useAllProducts: () => ({
    products: mockProducts,
    loading,
    error
  })
}));

describe('ProductsList', () => {
  beforeEach(() => {
    loading = false;
    error = null;
    jest.clearAllMocks();
  });

  it('renders the header and title', () => {
    render(<ProductsList />);
    expect(screen.getByTestId('admin-header')).toBeInTheDocument();
    expect(screen.getByText(/Products List/i)).toBeInTheDocument();
  });

  it('renders the products', () => {
    render(<ProductsList />);
    expect(screen.getByText('Product1')).toBeInTheDocument();
    expect(screen.getByText('Product2')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    loading = true;
    render(<ProductsList />);
    expect(screen.getByText(/loading products/i)).toBeInTheDocument();
  });

  it('shows error state', () => {
    error = 'Error loading products';
    render(<ProductsList />);
    expect(screen.getByText('Error loading products')).toBeInTheDocument();
  });

  it('filters products by date', () => {
    render(<ProductsList />);
    const select = screen.getByTestId('order-date-filter');
    fireEvent.change(select, { target: { value: 'all' } });
    expect(select).toHaveValue('all');
  });
});