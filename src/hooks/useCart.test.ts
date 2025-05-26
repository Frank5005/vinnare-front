import { renderHook, act } from '@testing-library/react';
import { useCart } from './useCart';
import { getCart, removeFromCart, useCoupon, viewPreview, buyProducts } from '../services/shopperService';
import { usePurchase } from '../context/purchaseContext';
import { useNavigate } from 'react-router-dom';

jest.mock('../services/shopperService', () => ({
    getCart: jest.fn(),
    removeFromCart: jest.fn(),
    useCoupon: jest.fn(),
    viewPreview: jest.fn(),
    buyProducts: jest.fn()
}));

jest.mock('../context/purchaseContext', () => ({
    usePurchase: jest.fn()
}));

jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn()
}));

describe('useCart', () => {
    const mockNavigate = jest.fn();
    const mockSetData = jest.fn();
    const mockData = {};

    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
        (usePurchase as jest.Mock).mockReturnValue({ data: mockData, setData: mockSetData });
    });

    describe('Initial State and Cart Loading', () => {
        it('should initialize with empty cart and loading state', async () => {
            (getCart as jest.Mock).mockResolvedValue([]);
            
            const { result } = renderHook(() => useCart());
            
            expect(result.current.loading).toBe(true);
            expect(result.current.cartItems).toEqual([]);
            expect(result.current.error).toBeNull();
        });

        it('should load cart items successfully', async () => {
            const mockCartItems = [
                { id: 1, name: 'Product 1', price: 100, quantity: 1 },
                { id: 2, name: 'Product 2', price: 200, quantity: 2 }
            ];
            (getCart as jest.Mock).mockResolvedValue(mockCartItems);

            const { result } = renderHook(() => useCart());

            await act(async () => {
                await new Promise(resolve => setTimeout(resolve, 0));
            });

            expect(result.current.cartItems).toEqual(mockCartItems);
            expect(result.current.loading).toBe(false);
            expect(result.current.error).toBeNull();
        });

        it('should handle cart loading error', async () => {
            const errorMessage = 'Failed to load cart';
            (getCart as jest.Mock).mockRejectedValue(new Error(errorMessage));

            const { result } = renderHook(() => useCart());

            await act(async () => {
                await new Promise(resolve => setTimeout(resolve, 0));
            });

            expect(result.current.error).toBe(errorMessage);
            expect(result.current.loading).toBe(false);
        });
    });

    describe('Cart Operations', () => {
        it('should check if item is in cart', async () => {
            const mockCartItems = [{ id: 1, name: 'Product 1', price: 100, quantity: 1 }];
            (getCart as jest.Mock).mockResolvedValue(mockCartItems);

            const { result } = renderHook(() => useCart());

            await act(async () => {
                await new Promise(resolve => setTimeout(resolve, 0));
            });

            expect(result.current.inCart(1)).toBe(true);
            expect(result.current.inCart(2)).toBe(false);
        });

        it('should remove item from cart', async () => {
            const mockCartItems = [{ id: 1, name: 'Product 1', price: 100, quantity: 1 }];
            (getCart as jest.Mock).mockResolvedValue(mockCartItems);
            (removeFromCart as jest.Mock).mockResolvedValue({ success: true });

            const { result } = renderHook(() => useCart());

            await act(async () => {
                await new Promise(resolve => setTimeout(resolve, 0));
            });

            await act(async () => {
                await result.current.ToggleCart(1);
            });

            expect(removeFromCart).toHaveBeenCalledWith(1);
        });
    });

    describe('Coupon Operations', () => {     

        it('should handle invalid coupon', async () => {
            const errorMessage = 'Invalid coupon code';
            (useCoupon as jest.Mock).mockRejectedValue(new Error(errorMessage));

            const { result } = renderHook(() => useCart());

            await act(async () => {
                result.current.setCouponCode('INVALID');
                await result.current.handleApplyCoupon({ key: 'Enter' } as React.KeyboardEvent<HTMLInputElement>);
            });

            expect(result.current.discount).toBe(0);
            expect(result.current.error).toBe(errorMessage);
        });
    });

    describe('Purchase Operations', () => {
        it('should handle successful purchase', async () => {
            (buyProducts as jest.Mock).mockResolvedValue({ success: true });

            const { result } = renderHook(() => useCart());

            await act(async () => {
                await result.current.buyingProducts();
            });

            expect(buyProducts).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('/my-orders');
        });

        it('should handle purchase error', async () => {
            const errorMessage = 'Purchase failed';
            (buyProducts as jest.Mock).mockRejectedValue(new Error(errorMessage));

            const { result } = renderHook(() => useCart());

            await act(async () => {
                await result.current.buyingProducts();
            });

            expect(result.current.error).toBe(errorMessage);
        });
    });

    describe('Preview Operations', () => {
        it('should fetch preview successfully', async () => {
            const mockPreview = { total: 100, discount: 10 };
            (viewPreview as jest.Mock).mockResolvedValue(mockPreview);

            const { result } = renderHook(() => useCart());

            await act(async () => {
                await result.current.fetchPreview();
            });

            expect(viewPreview).toHaveBeenCalled();
            expect(mockSetData).toHaveBeenCalledWith(mockPreview);
        });

        it('should handle preview error', async () => {
            const errorMessage = 'Preview failed';
            (viewPreview as jest.Mock).mockRejectedValue(new Error(errorMessage));

            const { result } = renderHook(() => useCart());

            await act(async () => {
                await result.current.fetchPreview();
            });

            expect(result.current.error).toBe(errorMessage);
        });
    });

    describe('Total Calculations', () => {
        it('should calculate subtotal correctly', async () => {
            const mockCartItems = [
                { id: 1, name: 'Product 1', price: 100, quantity: 2 },
                { id: 2, name: 'Product 2', price: 200, quantity: 1 }
            ];
            (getCart as jest.Mock).mockResolvedValue(mockCartItems);

            const { result } = renderHook(() => useCart());

            await act(async () => {
                await new Promise(resolve => setTimeout(resolve, 0));
            });

            expect(result.current.subtotal).toBe(400); // (100 * 2) + (200 * 1)
        });

        it('should calculate discounted total correctly', async () => {
            const mockCartItems = [
                { id: 1, name: 'Product 1', price: 100, quantity: 2 },
                { id: 2, name: 'Product 2', price: 200, quantity: 1 }
            ];
            (getCart as jest.Mock).mockResolvedValue(mockCartItems);
            (useCoupon as jest.Mock).mockResolvedValue({ discountPercentage: 10 });

            const { result } = renderHook(() => useCart());

            await act(async () => {
                await new Promise(resolve => setTimeout(resolve, 0));
                result.current.setCouponCode('DISCOUNT10');
                await result.current.handleApplyCoupon({ key: 'Enter' } as React.KeyboardEvent<HTMLInputElement>);
            });

            expect(result.current.discountedTotal).toBe(360); // 400 - (400 * 0.1)
        });
    });
});
