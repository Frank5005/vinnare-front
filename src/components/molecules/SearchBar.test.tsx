import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SearchBar } from './SearchBar';
import { useProductSearch } from '../../hooks/useProductSearch';

jest.mock('../../hooks/useProductSearch');

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

describe('SearchBar', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useProductSearch as jest.Mock).mockReturnValue({
            products: [],
            loading: false
        });
    });

    it('renders the search bar', () => {
        render(
            <MemoryRouter>
                <SearchBar />
            </MemoryRouter>
        );
        expect(screen.getByPlaceholderText(/search products.../i)).toBeInTheDocument();
        expect(screen.getByTestId('search-icon')).toBeInTheDocument();
    });
    it('not shows search results when product not found', () => {
        render(
            <MemoryRouter>
                <SearchBar />
            </MemoryRouter>
        );
        const input = screen.getByTestId('search-input');
        fireEvent.change(input, { target: { value: 'test product' } });
        expect(screen.getByText('No products found')).toBeInTheDocument();
    });

    it('shows search results when product exists', () => {
        (useProductSearch as jest.Mock).mockReturnValue({
            products: [{
                id: 1,
                title: 'test product',
                price: 99.99,
                image: 'test-image.jpg'
            }],
            loading: false
        });

        render(
            <MemoryRouter>
                <SearchBar />
            </MemoryRouter>
        );
        
        const input = screen.getByTestId('search-input');
        fireEvent.change(input, { target: { value: 'test product' } });
        expect(screen.getByText('test product')).toBeInTheDocument();
        expect(screen.getByText('$99.99')).toBeInTheDocument();
    });

    it('shows loading state when products are loading', () => {
        (useProductSearch as jest.Mock).mockReturnValue({
            products: [],
            loading: true
        });
        render(
            <MemoryRouter>
                <SearchBar />
            </MemoryRouter>
        );
        const input = screen.getByTestId('search-input');
        fireEvent.change(input, { target: { value: 'test' } });
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('navigates to product details page when product is clicked', () => {
        (useProductSearch as jest.Mock).mockReturnValue({
            products: [{
                id: 1,
                title: 'test product',
                price: 99.99,
                image: 'test-image.jpg'
            }],
            loading: false
        });

        render(
            <MemoryRouter>
                <SearchBar />
            </MemoryRouter>
        );

        const input = screen.getByTestId('search-input');
        fireEvent.change(input, { target: { value: 'test product' } }); 
        const product = screen.getByText('test product');
        fireEvent.click(product);
        expect(mockNavigate).toHaveBeenCalledWith('/product/1');
    }); 

    it('click outside the search bar closes it', () => {
        render(
            <MemoryRouter>
                <SearchBar />
            </MemoryRouter>
        );
        const input = screen.getByTestId('search-input');
        fireEvent.change(input, { target: { value: 'test product' } });
        expect(screen.getByTestId('search-dropdown')).toBeInTheDocument();
        fireEvent.mouseDown(document.body);
        expect(screen.queryByTestId('search-dropdown')).not.toBeInTheDocument();
    });
});
