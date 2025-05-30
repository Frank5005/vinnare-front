import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import MyOrders from './MyOrders';
import { usePurchases } from '../../hooks/usePurchases';

// Mock components
jest.mock('../../components/organisms/Header', () => () => <div>Mock Header</div>);
jest.mock('../../components/organisms/Footer', () => () => <div>Mock Footer</div>);
jest.mock('../../components/molecules/OrderDateFilter', () => ({ value, onChange }: any) => (
  <select title="filter" data-testid="filter" value={value} onChange={(e) => onChange(e.target.value)}>
    <option value="7">Last 7 Days</option>
    <option value="30">Last 30 Days</option>
    <option value="all">All</option>
  </select>
));
jest.mock('./OrderDetail', () => ({ order, onClose }: any) => (
  <div>
    <div>Order Detail Modal: {order.id}</div>
    <button onClick={onClose}>Close</button>
  </div>
));

// Mock the hook
jest.mock('../../hooks/usePurchases');

const mockPurchases = [
  {
    id: '1',
    userName: 'Alice',
    paymentStatus: 'paid',
    totalPrice: 99.99,
    address: '123 Lane',
    date: new Date().toISOString(),
    status: 'delivered'
  },
  {
    id: '2',
    userName: 'Bob',
    paymentStatus: 'pending',
    totalPrice: 49.5,
    address: '456 Street',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    status: 'processing'
  }
];

describe('MyOrders Page', () => {
  it('renders loading state initially', async () => {
    (usePurchases as jest.Mock).mockReturnValue({
      purchases: [],
      loading: true,
      error: null,
    });

    render(<MyOrders />);
    expect(screen.getByText(/Mock Header/i)).toBeInTheDocument();
    expect(screen.getByText(/Mock Footer/i)).toBeInTheDocument();
  });

  it('renders orders and filters them based on date', async () => {
    (usePurchases as jest.Mock).mockReturnValue({
      purchases: mockPurchases,
      loading: false,
      error: null,
    });

    render(<MyOrders />);
    expect(screen.getByText('My Orders')).toBeInTheDocument();

    // Default filter: last 7 days — only one order should appear
    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.queryByText('Bob')).not.toBeInTheDocument();
    });

    // Change filter to "all" to show both orders
    fireEvent.change(screen.getByTestId('filter'), { target: { value: 'all' } });

    await waitFor(() => {
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });
  });

  it('opens and closes order detail modal', async () => {
    (usePurchases as jest.Mock).mockReturnValue({
      purchases: mockPurchases,
      loading: false,
      error: null,
    });

    render(<MyOrders />);
    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Alice'));
    expect(screen.getByText(/Order Detail Modal: 1/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByText(/Order Detail Modal/i)).not.toBeInTheDocument();
  });

  it('handles error state', () => {
    (usePurchases as jest.Mock).mockReturnValue({
      purchases: [],
      loading: false,
      error: 'Something went wrong',
    });

    render(<MyOrders />);
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });
});
