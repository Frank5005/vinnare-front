import { renderHook } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import { usePurchases } from './usePurchases';
import api from '../services/api';

jest.mock('../services/api');

const mockedApi = api as jest.Mocked<typeof api>;

describe('usePurchases hook', () => {
  const originalLocalStorage = window.localStorage;

  beforeEach(() => {
    jest.clearAllMocks();
    const localStorageMock = (function () {
      let store: Record<string, string> = {};
      return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
          store[key] = value;
        },
        clear: () => {
          store = {};
        }
      };
    })();
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  });

  afterAll(() => {
    Object.defineProperty(window, 'localStorage', { value: originalLocalStorage });
  });

  it('returns purchases with userName from localStorage when not present in data', async () => {
    window.localStorage.setItem('userName', 'TestUser');
    mockedApi.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          products: [101],
          prices: [10],
          quantities: [1],
          userId: 'u1',
          userName: '',
          couponCode: null,
          totalPrice: 10,
          totalPriceBeforeDiscount: 10,
          date: new Date().toISOString(),
          address: '123 Main St',
          paymentStatus: 'paid',
          status: 'delivered'
        }
      ]
    });

    const { result } = renderHook(() => usePurchases());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.purchases).toHaveLength(1);
    expect(result.current.purchases[0].userName).toBe('TestUser');
  });

  it('sets error when fetch fails', async () => {
    mockedApi.get.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => usePurchases());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toMatch(/Network error/);
    expect(result.current.purchases).toEqual([]);
  });

  it('defaults to loading true and updates to false after fetch', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: [] });

    const { result } = renderHook(() => usePurchases());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
});
