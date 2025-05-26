import { render, screen, fireEvent } from '@testing-library/react';
import HamburgerMenu from './HamburgerMenu';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import { useAuth } from '../../context/AuthContext';

jest.mock('../../context/AuthContext', () => ({
    useAuth: jest.fn()
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

describe('HamburgerMenu', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useAuth as jest.Mock).mockReturnValue({
            isLoggedIn: false,
            userName: '',
            logout: jest.fn()
        });
    });
    it('should render correctly when user is not logged in', () => {
        render(
            <MemoryRouter>
                <HamburgerMenu isLoggedIn={false} />
            </MemoryRouter>
        );
        fireEvent.click(screen.getByLabelText('Open menu'));
        expect(screen.getByText('Shop List')).toBeInTheDocument();
        expect(screen.getByText('Wishlist')).toBeInTheDocument();
        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByTestId('search-bar')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
    });

    it('should render correctly when user is logged in', () => {
        (useAuth as jest.Mock).mockReturnValue({
            isLoggedIn: true,
            userName: 'John Doe',
            logout: jest.fn()
        });
        render(
            <MemoryRouter>
                <HamburgerMenu 
                    isLoggedIn={true} 
                    userName="John Doe"
                    cartCount={5}
                />
            </MemoryRouter>
        );
        fireEvent.click(screen.getByLabelText('Open menu'));
        expect(screen.getByText('Shop List')).toBeInTheDocument();
        expect(screen.getByText('Wishlist')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
        expect(screen.getByTestId('search-bar')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
        expect(screen.getByTestId('cart-icon')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('should handle logout', () => {
        const mockLogout = jest.fn();
        (useAuth as jest.Mock).mockReturnValue({
            isLoggedIn: true,
            userName: 'John Doe',
            logout: mockLogout
        });
        render(
            <MemoryRouter>
                <HamburgerMenu isLoggedIn={true} />
            </MemoryRouter>
        );
        fireEvent.click(screen.getByLabelText('Open menu'));
        fireEvent.click(screen.getByText('Logout'));
        expect(mockLogout).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('should navigate to shop list when clicked', () => {
        render(
            <MemoryRouter>
                <HamburgerMenu isLoggedIn={false} />
            </MemoryRouter>
        );
        fireEvent.click(screen.getByLabelText('Open menu'));
        fireEvent.click(screen.getByText('Shop List'));
        expect(mockNavigate).toHaveBeenCalledWith('/shop-list');
    });

    it('should navigate to wishlist when clicked', () => {
        render(
            <MemoryRouter>
                <HamburgerMenu isLoggedIn={false} />
            </MemoryRouter>
        );
        fireEvent.click(screen.getByLabelText('Open menu'));
        fireEvent.click(screen.getByText('Wishlist'));
        expect(mockNavigate).toHaveBeenCalledWith('/wishlist');
    });

    it('should navigate to login when clicked', () => {
        render(
            <MemoryRouter>
                <HamburgerMenu isLoggedIn={false} />
            </MemoryRouter>
        );
        fireEvent.click(screen.getByLabelText('Open menu'));
        fireEvent.click(screen.getByText('Login'));
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('should navigate to cart when cart icon is clicked', () => {
        render(
            <MemoryRouter>
                <HamburgerMenu 
                    isLoggedIn={true} 
                    userName="John Doe"
                    cartCount={5}
                />
            </MemoryRouter>
        );
        fireEvent.click(screen.getByLabelText('Open menu'));
        fireEvent.click(screen.getByTestId('cart-icon'));
        expect(mockNavigate).toHaveBeenCalledWith('/cart');
    });

    it('should close menu when close button is clicked', () => {
        render(
            <MemoryRouter>
                <HamburgerMenu isLoggedIn={false} />
            </MemoryRouter>
        );
        fireEvent.click(screen.getByLabelText('Open menu'));
        expect(screen.getByText('Shop List')).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('Close menu'));
        expect(screen.queryByText('Shop List')).not.toBeInTheDocument();
    });
});