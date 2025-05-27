import { render, screen, fireEvent } from '@testing-library/react';
import AdminEmployeeHomepage from './AdminEmployeeHomepage';
import React from 'react';
jest.mock('../../components/organisms/AdminHeader', () => () => <div data-testid="admin-header">Header</div>);

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('AdminEmployeeHomepage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
  });

  it('renders the header and title', () => {
    localStorage.setItem('userRole', 'Admin');
    render(<AdminEmployeeHomepage />);
    expect(screen.getByTestId('admin-header')).toBeInTheDocument();
    expect(screen.getByText(/Employee Portal/i)).toBeInTheDocument();
  });

  it('shows only Seller/Admin buttons for Seller', () => {
    localStorage.setItem('userRole', 'Seller');
    render(<AdminEmployeeHomepage />);
    expect(screen.queryByText('Review Jobs')).not.toBeInTheDocument();
    expect(screen.queryByText('Create Employee')).not.toBeInTheDocument();
    expect(screen.queryByText('View All Users')).not.toBeInTheDocument();
    
    expect(screen.getByText('Create Product')).toBeInTheDocument();
    expect(screen.getByText('Create Category')).toBeInTheDocument();
    expect(screen.getByText('List Products')).toBeInTheDocument();
    expect(screen.getByText('List Categories')).toBeInTheDocument();
  });

  it('shows all buttons for Admin', () => {
    localStorage.setItem('userRole', 'Admin');
    render(<AdminEmployeeHomepage />);
    expect(screen.getByText('Create Product')).toBeInTheDocument();
    expect(screen.getByText('Create Category')).toBeInTheDocument();
    expect(screen.getByText('List Products')).toBeInTheDocument();
    expect(screen.getByText('List Categories')).toBeInTheDocument();
    expect(screen.getByText('Review Jobs')).toBeInTheDocument();
    expect(screen.getByText('Create Employee')).toBeInTheDocument();
    expect(screen.getByText('View All Users')).toBeInTheDocument();
  });

  it('navigates to the correct path when a button is clicked', () => {
    localStorage.setItem('userRole', 'Admin');
    render(<AdminEmployeeHomepage />);
    const button = screen.getByText('Create Product');
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith('/admin/create-product');
  });
});