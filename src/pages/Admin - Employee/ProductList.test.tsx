import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import ProductsList from './ProductsList';
import React from 'react';
import api from '../../services/api';

jest.mock('../../components/organisms/AdminHeader', () => () => <div data-testid="admin-header">Header</div>);

jest.mock('../../components/organisms/DataTable', () => {
  const actual = jest.requireActual('../../components/organisms/DataTable');
  return {
    ...actual,
    DataTable: actual.DataTable,
  };
});

jest.mock('../../components/molecules/OrderDateFilter', () => ({ value, onChange }: any) => (
  <select title="order-data-filter" data-testid="order-date-filter" value={value} onChange={e => onChange(e.target.value)}>
    <option value="7">Last 7 Days</option>
    <option value="all">All</option>
  </select>
));

jest.mock('../../services/api', () => ({
  delete: jest.fn(),
  put: jest.fn()
}));

const mockProducts = [
  { id: 1, title: 'Product1', price: 10, quantity: 5, available: 5, ownerId: 1, category: 'Cat', image: '', approved: true, date: new Date().toISOString() },
  { id: 2, title: 'Product2', price: 20, quantity: 10, available: 10, ownerId: 2, category: 'Cat', image: '', approved: false, date: new Date().toISOString() }
];
let loading = false;
let error: string | null = null;
let currentProducts = [...mockProducts];

jest.mock('../../hooks/useAllProducts', () => ({
  useAllProducts: () => ({
    products: currentProducts,
    loading,
    error
  })
}));

describe('ProductsList', () => {
  beforeEach(() => {
    loading = false;
    error = null;
    currentProducts = [...mockProducts];
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

  it('handles edit and save', async () => {
    render(<ProductsList />);
    const row = screen.getByText('Product1').closest('tr');
    if (row) {
      const editButton = within(row).getByLabelText('Edit');
      fireEvent.click(editButton);
      
      const titleInput = within(row).getByPlaceholderText('Title');
      fireEvent.change(titleInput, { target: { value: 'Updated Product' } });
      
      const saveButton = within(row).getByLabelText('Save');
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(api.put).toHaveBeenCalledWith('/api/product/1', expect.any(Object));
      });
    }
  });

  it('shows error when trying to edit unapproved product', async () => {
    (api.put as jest.Mock).mockRejectedValueOnce(new Error('Product not approved'));
    render(<ProductsList />);
    const row = screen.getByText('Product2').closest('tr');
    if (row) {
      const editButton = within(row).getByLabelText('Edit');
      fireEvent.click(editButton);
      const saveButton = within(row).getByLabelText('Save');
      fireEvent.click(saveButton);
      await waitFor(() => {
        expect(screen.getByText('Failed to update product. Please try again.')).toBeInTheDocument();
      });
    }
  });

  it('shows message when seller deletes product', async () => {
    localStorage.clear();
    localStorage.setItem('userName', 'testuser');
    localStorage.setItem('userRole', 'Seller');
    const mockMessage = 'Product deletion request sent for approval';
    
    (api.delete as jest.Mock).mockResolvedValueOnce({
      status: 200,
      data: {
        message: mockMessage
      }
    });

    render(<ProductsList />);
    const row = screen.getByText('Product1').closest('tr');
    if (row) {
      const deleteButton = within(row).getByLabelText('Delete');
      fireEvent.click(deleteButton);
      
      await waitFor(() => {
        const errorDiv = screen.getByText(mockMessage + " Please wait for the admin to approve.");
        expect(errorDiv).toBeInTheDocument();
      });
      
      expect(screen.getByText('Product1')).toBeInTheDocument();
    }
  });

  it('shows error when trying to delete unapproved product', async () => {
    (api.delete as jest.Mock).mockRejectedValueOnce(new Error('Delete failed'));
    render(<ProductsList />);
    const row = screen.getByText('Product2').closest('tr');
    if (row) {
      const deleteButton = within(row).getByLabelText('Delete');
      fireEvent.click(deleteButton);
      await waitFor(() => {
        expect(screen.getByText('Failed to delete product that is not approved.')).toBeInTheDocument();
      });
    }
  });

  it('can cancel edit', () => {
    render(<ProductsList />);
    const row = screen.getByText('Product1').closest('tr');
    if (row) {
      const editButton = within(row).getByLabelText('Edit');
      fireEvent.click(editButton);
      const cancelButton = within(row).getByLabelText('Cancel');
      fireEvent.click(cancelButton);
      expect(within(row).queryByPlaceholderText('Title')).toBeNull();
    }
  });

  it('updates products when initialProducts changes', async () => {
    render(<ProductsList />);
    expect(screen.getByText('Product1')).toBeInTheDocument();
    currentProducts.length = 0;
    currentProducts.push(
      { id: 1, title: 'Product1', price: 10, quantity: 5, available: 5, ownerId: 1, category: 'Cat', image: '', approved: true, date: new Date().toISOString() },
      { id: 2, title: 'Product2', price: 20, quantity: 10, available: 10, ownerId: 2, category: 'Cat', image: '', approved: false, date: new Date().toISOString() },
      { id: 3, title: 'Product3', price: 30, quantity: 15, available: 15, ownerId: 3, category: 'Cat', image: '', approved: true, date: new Date().toISOString() }
    );
    render(<ProductsList />);
    await waitFor(() => {
      expect(screen.getByText('Product3')).toBeInTheDocument();
    });
  });

  it('shows error when username is not in localStorage during delete', async () => {
    localStorage.removeItem('userName');
    render(<ProductsList />);
    const row = screen.getByText('Product1').closest('tr');
    if (row) {
      const deleteButton = within(row).getByLabelText('Delete');
      fireEvent.click(deleteButton);
      await waitFor(() => {
        expect(screen.getByText('Failed to delete product. Please try again.')).toBeInTheDocument();
      });
    }
  });

  it('handles input changes correctly', () => {
    render(<ProductsList />);
    const row = screen.getByText('Product1').closest('tr');
    if (row) {
      const editButton = within(row).getByLabelText('Edit');
      fireEvent.click(editButton);
      
      const titleInput = within(row).getByPlaceholderText('Title');
      const priceInput = within(row).getByPlaceholderText('Price');
      const quantityInput = within(row).getByPlaceholderText('Quantity');
      const availableInput = within(row).getByPlaceholderText('Available');

      fireEvent.change(titleInput, { target: { value: 'New Title' } });
      fireEvent.change(priceInput, { target: { value: '15.99' } });
      fireEvent.change(quantityInput, { target: { value: '10' } });
      fireEvent.change(availableInput, { target: { value: '8' } });

      expect(titleInput).toHaveValue('New Title');
      expect(priceInput).toHaveValue(15.99);
      expect(quantityInput).toHaveValue(10);
      expect(availableInput).toHaveValue(8);
    }
  });

  it('shows error when product not found during edit', async () => {
    (api.put as jest.Mock).mockRejectedValueOnce(new Error('Product not found'));
    render(<ProductsList />);
    const row = screen.getByText('Product1').closest('tr');
    if (row) {
      const editButton = within(row).getByLabelText('Edit');
      fireEvent.click(editButton);
      currentProducts = currentProducts.filter(p => p.id !== 1);
      const saveButton = within(row).getByLabelText('Save');
      fireEvent.click(saveButton);
      await waitFor(() => {
        expect(screen.getByText('Failed to update product. Please try again.')).toBeInTheDocument();
      });
    }
  });

  it('handles save with original product data', async () => {
    (api.put as jest.Mock).mockResolvedValueOnce({ status: 200 });
    render(<ProductsList />);
    const row = screen.getByText('Product1').closest('tr');
    if (row) {
      const editButton = within(row).getByLabelText('Edit');
      fireEvent.click(editButton);
      const saveButton = within(row).getByLabelText('Save');
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(api.put).toHaveBeenCalledWith('/api/product/1', {
          title: 'Product1',
          price: 10,
          quantity: 5,
          available: 5,
          category: 'Cat'
        });
      });
    }
  });

  it('handles save with updated product data', async () => {
    (api.put as jest.Mock).mockResolvedValueOnce({ status: 200 });
    render(<ProductsList />);
    const row = screen.getByText('Product1').closest('tr');
    if (row) {
      const editButton = within(row).getByLabelText('Edit');
      fireEvent.click(editButton);
      
      const titleInput = within(row).getByPlaceholderText('Title');
      const priceInput = within(row).getByPlaceholderText('Price');
      const quantityInput = within(row).getByPlaceholderText('Quantity');
      const availableInput = within(row).getByPlaceholderText('Available');

      fireEvent.change(titleInput, { target: { value: 'Updated Product' } });
      fireEvent.change(priceInput, { target: { value: '15.99' } });
      fireEvent.change(quantityInput, { target: { value: '10' } });
      fireEvent.change(availableInput, { target: { value: '8' } });

      const saveButton = within(row).getByLabelText('Save');
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(api.put).toHaveBeenCalledWith('/api/product/1', {
          title: 'Updated Product',
          price: 15.99,
          quantity: 10,
          available: 8,
          category: 'Cat'
        });
      });
    }
  });

  it('removes product from list when delete is successful', async () => {
    localStorage.setItem('userName', 'testuser');
    localStorage.setItem('userRole', 'Admin');
    (api.delete as jest.Mock).mockResolvedValueOnce({ status: 200 });
    
    render(<ProductsList />);
    const row = screen.getByText('Product1').closest('tr');
    if (row) {
      const deleteButton = within(row).getByLabelText('Delete');
      fireEvent.click(deleteButton);
      
      await waitFor(() => {
        expect(api.delete).toHaveBeenCalledWith('/api/product/1', {
          headers: {
            'Username': 'testuser'
          }
        });
        expect(screen.queryByText('Product1')).not.toBeInTheDocument();
      });
    }
  });
});