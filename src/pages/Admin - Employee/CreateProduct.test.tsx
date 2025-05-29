import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateProduct from './CreateProduct';
import React from 'react';
import api from '../../services/api';

jest.mock('../../components/organisms/AdminHeader', () => () => <div data-testid="admin-header">Header</div>);
jest.mock('../../components/atoms/InputField', () => ({ label, name, value, onChange, required, type = "text" }: any) => (
  <div>
    <label htmlFor={name}>{label}</label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      data-testid={`input-${name}`}
    />
  </div>
));
jest.mock('../../components/atoms/Button', () => ({ children, disabled, type, className }: any) => (
  <button type={type} disabled={disabled} className={className} data-testid="submit-button">
    {children}
  </button>
));
jest.mock('../../layouts/FormCardLayout', () => ({ children, title }: any) => (
  <div data-testid="form-card">
    <h2>{title}</h2>
    {children}
  </div>
));

jest.mock('../../services/api', () => ({
  get: jest.fn(),
  post: jest.fn()
}));

describe('CreateProduct', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders the form with all fields', () => {
    render(<CreateProduct />);
    expect(screen.getByTestId('admin-header')).toBeInTheDocument();
    expect(screen.getByText('Employee Portal')).toBeInTheDocument();
    expect(screen.getByTestId('form-card')).toBeInTheDocument();
    
    const requiredFields = ['title', 'price', 'category', 'description', 'image', 'quantity', 'available'];
    requiredFields.forEach(field => {
      expect(screen.getByTestId(`input-${field}`)).toBeInTheDocument();
    });
  });

  it('handles form input changes', () => {
    render(<CreateProduct />);
    const titleInput = screen.getByTestId('input-title');
    fireEvent.change(titleInput, { target: { value: 'Test Product' } });
    expect(titleInput).toHaveValue('Test Product');
  });

  it('creates product successfully', async () => {
    localStorage.setItem('userName', 'testuser');
    (api.get as jest.Mock).mockResolvedValueOnce({ data: { id: '123' } });
    (api.post as jest.Mock).mockResolvedValueOnce({ 
      data: { 
        message: 'Product created successfully' 
      } 
    });

    render(<CreateProduct />);

    const formData = {
      title: 'Test Product',
      price: '10.99',
      category: 'Test Category',
      description: 'Test Description',
      image: 'https://example.com/image.jpg',
      quantity: '5',
      available: '3'
    };

    Object.entries(formData).forEach(([field, value]) => {
      const input = screen.getByTestId(`input-${field}`);
      fireEvent.change(input, { target: { value } });
    });

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/api/user/id/testuser');
      expect(api.post).toHaveBeenCalledWith('/api/product/create', {
        ...formData,
        ownerId: '123',
        price: 10.99,
        quantity: 5,
        available: 3,
        username: 'testuser'
      });
      expect(screen.getByText('Product created successfully')).toBeInTheDocument();
    });

    await waitFor(() => {
      const titleInput = screen.getByTestId('input-title');
      expect(titleInput).toHaveValue('');
    });
  });

  it('shows error message when API call fails', async () => {
    localStorage.setItem('userName', 'testuser');
    (api.get as jest.Mock).mockResolvedValueOnce({ data: { id: '123' } });
    (api.post as jest.Mock).mockRejectedValueOnce({ 
      response: { 
        data: { 
          message: 'Failed to create product' 
        } 
      } 
    });

    render(<CreateProduct />);
    
    const formData = {
      title: 'Test Product',
      price: '10.99',
      category: 'Test Category',
      description: 'Test Description',
      image: 'https://example.com/image.jpg',
      quantity: '5',
      available: '3'
    };

    Object.entries(formData).forEach(([field, value]) => {
      const input = screen.getByTestId(`input-${field}`);
      fireEvent.change(input, { target: { value } });
    });

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to create product')).toBeInTheDocument();
    });
  });

  it('disables submit button while loading', async () => {
    localStorage.setItem('userName', 'testuser');
    (api.get as jest.Mock).mockResolvedValueOnce({ data: { id: '123' } });
    (api.post as jest.Mock).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<CreateProduct />);
    
    const formData = {
      title: 'Test Product',
      price: '10.99',
      category: 'Test Category',
      description: 'Test Description',
      image: 'https://example.com/image.jpg',
      quantity: '5',
      available: '3'
    };

    Object.entries(formData).forEach(([field, value]) => {
      const input = screen.getByTestId(`input-${field}`);
      fireEvent.change(input, { target: { value } });
    });

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(screen.getByText('Creating...')).toBeInTheDocument();
  });
});
