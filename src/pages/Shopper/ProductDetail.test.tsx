import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductDetail from './ProductDetail';
import * as shopperService from '../../services/shopperService';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom';
import toast from 'react-hot-toast';

jest.mock('../../services/shopperService');
jest.mock('react-hot-toast', () => {
    const toast = () => { };
    toast.success = jest.fn();
    toast.error = jest.fn();
    return toast;
});
jest.mock('../../components/organisms/Header', () => () => <div>Header</div>);
jest.mock('../../components/organisms/Footer', () => () => <div>Footer</div>);

describe('ProductDetail', () => {
    const mockProduct = {
        id: 1,
        title: 'Test Product',
        price: 100,
        description: 'A test product',
        image: 'test.jpg',
        available: 10
    };

    const setup = () => {
        (shopperService.getWishlist as jest.Mock).mockResolvedValue([]);
        (shopperService.getProductById as jest.Mock).mockResolvedValue(mockProduct);
        (shopperService.getCart as jest.Mock).mockResolvedValue([]);
        localStorage.setItem('userId', '1');

        render(
            <MemoryRouter initialEntries={['/product/1']}>
                <Routes>
                    <Route path="/product/:id" element={<ProductDetail />} />
                </Routes>
            </MemoryRouter>
        );
    };

    afterEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    describe('Rendering', () => {
        it('renders loading initially', async () => {
            (shopperService.getProductById as jest.Mock).mockImplementation(() => new Promise(() => { }));
            setup();
            expect(screen.getByText(/loading/i)).toBeInTheDocument();
        });

        it('renders product details', async () => {
            setup();
            await waitFor(() => {
                expect(screen.getByText('Test Product')).toBeInTheDocument();
            });
            expect(screen.getByText('$100')).toBeInTheDocument();
            expect(screen.getByText(/a test product/i)).toBeInTheDocument();
        });
    });

    describe('Quantity', () => {
        it('updates quantity on input change', async () => {
            setup();
            await waitFor(() => screen.getByText('Test Product'));

            const quantityInput = screen.getByLabelText(/quantity/i) as HTMLInputElement;
            fireEvent.change(quantityInput, { target: { value: '2' } });
            expect(quantityInput.value).toBe('2');
        });
    });

    describe('Add to Cart', () => {
        it('adds product to cart', async () => {
            setup();
            await waitFor(() => screen.getByText('Test Product'));

            (shopperService.addToCart as jest.Mock).mockResolvedValue({});
            const addToCartButton = screen.getByText(/add to cart/i);
            fireEvent.click(addToCartButton);

            await waitFor(() => {
                expect(shopperService.addToCart).toHaveBeenCalledWith(1, 1);
                expect(toast.success).toHaveBeenCalledWith('Product added to cart!');
            });
        });

        it('shows error toast on failure', async () => {
            setup();
            await waitFor(() => screen.getByText('Test Product'));

            (shopperService.addToCart as jest.Mock).mockRejectedValue(new Error('fail'));
            const addToCartButton = screen.getByText(/add to cart/i);
            fireEvent.click(addToCartButton);

            await waitFor(() => {
                expect(toast.error).toHaveBeenCalledWith('Error adding to cart');
            });
        });
    });
});
