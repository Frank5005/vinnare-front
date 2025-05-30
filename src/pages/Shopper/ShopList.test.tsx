import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ShopList from '../../pages/Shopper/ShopList';
import ShopProducts from '../../hooks/useShopList';

// Mocks
jest.mock('../../hooks/useShopList');
jest.mock('../../components/organisms/Header', () => () => <div data-testid="header">Header</div>);
jest.mock('../../components/organisms/Footer', () => () => <div data-testid="footer">Footer</div>);
jest.mock('../../components/organisms/ProductComponent', () => (props: any) => <div data-testid="product">{props.name}</div>);
jest.mock('../../components/molecules/FilterDropdown', () => (props: any) => (
  <select title="filter-dropdown" data-testid="filter-dropdown" value={props.value} onChange={(e) => props.onChange(e.target.value)}>
    <option value="price_low_high">Price (Low to High)</option>
    <option value="price_high_low">Price (High to Low)</option>
  </select>
));

describe('ShopList Page', () => {
  const mockUseShopProducts = ShopProducts as jest.Mock;

  const defaultHookData = {
    categories: [{ name: 'Electronics' }, { name: 'Books' }],
    sortOption: 'price_low_high',
    sortedFilteredProducts: [
      { id: 1, title: 'Laptop', image: 'laptop.jpg' },
      { id: 2, title: 'Book', image: 'book.jpg' },
    ],
    isLoading: false,
    hasMore: true,
    wishlistIds: [2],
    selectedCategories: ['Electronics'],
    setSortOption: jest.fn(),
    handleCategoryChange: jest.fn(),
    ToggleWishlist: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseShopProducts.mockReturnValue(defaultHookData);
  });

  it('renders header, footer, and page title', () => {
    render(<ShopList />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByText('Shop list')).toBeInTheDocument();
  });

  it('renders category filters and handles change', () => {
    render(<ShopList />);
    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Electronics'));
    expect(defaultHookData.handleCategoryChange).toHaveBeenCalledWith('Electronics');
  });

  it('renders FilterDropdown with correct value and changes option', () => {
    render(<ShopList />);
    const dropdown = screen.getByTestId('filter-dropdown');
    expect(dropdown).toHaveValue('price_low_high');
    fireEvent.change(dropdown, { target: { value: 'price_high_low' } });
    expect(defaultHookData.setSortOption).toHaveBeenCalledWith('price_high_low');
  });

  it('displays the correct number of products', () => {
    render(<ShopList />);
    const products = screen.getAllByTestId('product');
    expect(products.length).toBe(2);
    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('Book')).toBeInTheDocument();
  });

  /*
  it('shows loading spinner if loading and has more products', () => {
    mockUseShopProducts.mockReturnValueOnce({ ...defaultHookData, isLoading: true, hasMore: true });
    render(<ShopList />);
    expect(screen.getByRole('status')).toBeInTheDocument(); // animate-spin div
  });
  */

  it('shows message when all products are loaded', () => {
    mockUseShopProducts.mockReturnValueOnce({ ...defaultHookData, hasMore: false });
    render(<ShopList />);
    expect(screen.getByText('You have seen all products.')).toBeInTheDocument();
  });
});
