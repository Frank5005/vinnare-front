import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OrderDetail from './OrderDetail';

const mockOrder = {
    id: 42,
    userName: 'Alice Smith',
    paymentStatus: 'paid',
    totalPrice: 150.75,
    address: '123 Wonderland Ave',
    date: new Date('2023-10-01T14:30:00Z').toISOString(),
    status: 'shipped',
};

describe('OrderDetail Component', () => {
    it('renders all order details correctly', () => {
        render(<OrderDetail order={mockOrder} onClose={jest.fn()} />);
        expect(screen.getByText('Order Detail')).toBeInTheDocument();
        expect(screen.getByText('Order No.:')).toBeInTheDocument();
        expect(screen.getByText(mockOrder.id.toString())).toBeInTheDocument();
        expect(screen.getByText('Customer Name:')).toBeInTheDocument();
        expect(screen.getByText(mockOrder.userName)).toBeInTheDocument();   
        expect(screen.getByText('Payment Status:')).toBeInTheDocument();
        expect(screen.getByText(mockOrder.paymentStatus)).toBeInTheDocument();
        expect(screen.getByText('Amount:')).toBeInTheDocument();
        expect(screen.getByText(`$${mockOrder.totalPrice.toFixed(2)}`)).toBeInTheDocument();
        expect(screen.getByText('Address:')).toBeInTheDocument();
        expect(screen.getByText(mockOrder.address)).toBeInTheDocument();
        const formattedDate = new Date(mockOrder.date).toLocaleString();
        expect(screen.getByText('Order Date:')).toBeInTheDocument();
        expect(screen.getByText(formattedDate)).toBeInTheDocument();
        expect(screen.getByText('Status:')).toBeInTheDocument();
        expect(screen.getByText(mockOrder.status)).toBeInTheDocument();
    });

    it('calls onClose when the close button is clicked', () => {
        const onClose = jest.fn();
        render(<OrderDetail order={mockOrder} onClose={onClose} />);

        const closeButton = screen.getByLabelText('Close');
        fireEvent.click(closeButton);

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('formats the date correctly', () => {
        render(<OrderDetail order={mockOrder} onClose={jest.fn()} />);
        const expectedDate = new Date(mockOrder.date).toLocaleString();
        expect(screen.getByText(expectedDate)).toBeInTheDocument();
    });
});
