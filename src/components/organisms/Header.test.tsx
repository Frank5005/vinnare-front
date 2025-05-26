import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../hooks/useCart';

jest.mock('../../context/AuthContext');
jest.mock('../../hooks/useCart');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

describe('Header', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useAuth as jest.Mock).mockReturnValue({
            isLoggedIn: false,
            userName: '',
            logout: jest.fn()
        });
        (useCart as jest.Mock).mockReturnValue({
            totalItems: 0,
            initialTotal: 0
        });
    });

    it('renders correctly when user is not logged in', () => {
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );

        expect(screen.getByText('Tech Trend Emporium')).toBeInTheDocument();
        expect(screen.getByText('Shop List')).toBeInTheDocument();
        expect(screen.getByText('Wishlist')).toBeInTheDocument();
        expect(screen.getByText('My Orders')).toBeInTheDocument();
        expect(screen.getByText('Support')).toBeInTheDocument();
        expect(screen.getByText('USD')).toBeInTheDocument();
        expect(screen.getByText('FREE SHIPPING ON ALL HERMAN MILLER! FEB. 25–28.')).toBeInTheDocument();
        
        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.queryByText('0')).not.toBeInTheDocument();
    });

    it('renders correctly when user is logged in', () => {
        (useAuth as jest.Mock).mockReturnValue({
            isLoggedIn: true,
            userName: 'John Doe',
            logout: jest.fn()
        });
        (useCart as jest.Mock).mockReturnValue({
            totalItems: 5,
            initialTotal: 5
        });

        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument(); 
        expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('navigates to home when logo is clicked', () => {
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Tech Trend Emporium'));
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('navigates to login when login button is clicked', () => {
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Login'));
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('handles logout correctly', () => {
        const mockLogout = jest.fn();
        (useAuth as jest.Mock).mockReturnValue({
            isLoggedIn: true,
            userName: 'John Doe',
            logout: mockLogout
        });

        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Logout'));
        expect(mockLogout).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('navigates to cart when cart icon is clicked', () => {
        (useAuth as jest.Mock).mockReturnValue({
            isLoggedIn: true,
            userName: 'John Doe',
            logout: jest.fn()
        });

        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByTestId('cart-icon')); 
        expect(mockNavigate).toHaveBeenCalledWith('/cart');
    });

    it('if log in should show cart number', () => {
        (useAuth as jest.Mock).mockReturnValue({
            isLoggedIn: true,
            userName: 'John Doe',
            logout: jest.fn()
        });
        (useCart as jest.Mock).mockReturnValue({
            totalItems: 5,
            initialTotal: 5
        });
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );
        expect(screen.getByText('5')).toBeInTheDocument();
    });
});