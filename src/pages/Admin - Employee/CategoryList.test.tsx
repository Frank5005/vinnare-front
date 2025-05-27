import { render, screen, fireEvent } from '@testing-library/react';
import CategoryList from './CategoryList';
import React from 'react';

jest.mock('../../components/organisms/AdminHeader', () => () => <div data-testid="admin-header">Header</div>);

jest.mock('../../components/organisms/DataTable', () => {
  const actual = jest.requireActual('../../components/organisms/DataTable');
  return {
    ...actual,
    DataTable: actual.DataTable,
  };
});

const mockCategories = [
  { id: 1, name: 'Cat1', imageUrl: '', approved: true },
  { id: 2, name: 'Cat2', imageUrl: '', approved: false }
];
let loading = false;
let error: string | null = null;
jest.mock('../../hooks/useAllCategories', () => ({
  useAllCategories: () => ({
    categories: mockCategories,
    loading,
    error
  })
}));

describe('CategoryList', () => {
  beforeEach(() => {
    loading = false;
    error = null;
    jest.clearAllMocks();
  });

  it('renders the header and title', () => {
    render(<CategoryList />);
    expect(screen.getByTestId('admin-header')).toBeInTheDocument();
    expect(screen.getByText(/Category List/i)).toBeInTheDocument();
  });

  it('renders the categories', () => {
    render(<CategoryList />);
    expect(screen.getByText('Cat1')).toBeInTheDocument();
    expect(screen.getByText('Cat2')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    loading = true;
    render(<CategoryList />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows error state', () => {
    error = 'Error loading categories';
    render(<CategoryList />);
    expect(screen.getByText('Error loading categories')).toBeInTheDocument();
  });
});