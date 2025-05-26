import { render, screen, fireEvent } from '@testing-library/react';
import LandingPage from './LandingPage';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

const mockUseTopCategories = jest.fn();
const mockUseLatestProducts = jest.fn();
const mockUseTopSellingProducts = jest.fn();

jest.mock('../hooks/useTopCategories', () => ({
    useTopCategories: () => mockUseTopCategories()
}));

jest.mock('../hooks/useLatestProducts', () => ({
    useLatestProducts: () => mockUseLatestProducts()
}));

jest.mock('../hooks/useTopSellingProducts', () => ({
    useTopSellingProducts: () => mockUseTopSellingProducts()
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

type SectionHeaderProps = {
    title: string;
    description?: string;
    buttonText?: string;
    onButtonClick?: () => void;
};

jest.mock('../components/organisms/Header', () => () => <div data-testid="header">Header</div>);
jest.mock('../components/organisms/Footer', () => () => <div data-testid="footer">Footer</div>);
jest.mock('../components/organisms/ImageSlider', () => () => <div data-testid="image-slider">ImageSlider</div>);
jest.mock('../components/molecules/SectionHeader', () => 
    ({ title, description, buttonText, onButtonClick }: SectionHeaderProps) => (
      <div data-testid="section-header">
        <h2>{title}</h2>
        <p>{description}</p>
        {buttonText && <button onClick={onButtonClick}>{buttonText}</button>}
      </div>
    )
  );
  
jest.mock('../components/organisms/StaggeredImageGrid', () => ({ images }: { images: string[] }) => (
    <div data-testid="staggered-grid">
        {images.map((image: string, index: number) => (
            <img key={index} src={image} alt={index === 0 ? 'left' : index === 1 ? 'center' : 'right'} />
        ))}
    </div>
));

describe('LandingPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseTopCategories.mockReturnValue({
            categories: [
                { name: 'Electronics', imageUrl: 'electronics.jpg' },
                { name: 'Clothing', imageUrl: 'clothing.jpg' }
            ],
            loading: false,
            error: null
        });
        mockUseLatestProducts.mockReturnValue({
            products: [
                { image: 'product1.jpg' },
                { image: 'product2.jpg' },
                { image: 'product3.jpg' }
            ],
            loading: false,
            error: null
        });
        mockUseTopSellingProducts.mockReturnValue({
            products: [
                { title: 'Product 1', price: 100, image: 'product1.jpg', description: 'Description 1', category: 'Category 1' },
                { title: 'Product 2', price: 200, image: 'product2.jpg', description: 'Description 2', category: 'Category 2' }
            ],
            loading: false,
            error: null
        });
    });

    it('renders all main components', () => {
        render(
            <MemoryRouter>
                <LandingPage />
            </MemoryRouter>
        );

        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
        expect(screen.getByTestId('image-slider')).toBeInTheDocument();
    });

    it('renders all section headers with correct content', () => {
        render(
            <MemoryRouter>
                <LandingPage />
            </MemoryRouter>
        );

        const sectionHeaders = screen.getAllByTestId('section-header');
        expect(sectionHeaders).toHaveLength(3);

        expect(screen.getByText('Top Categories')).toBeInTheDocument();
        expect(screen.getByText(/Discover our most popular categories/i)).toBeInTheDocument();

        expect(screen.getByText('Latest Arrivals')).toBeInTheDocument();
        expect(screen.getByText(/Discover our newest additions/i)).toBeInTheDocument();

        expect(screen.getByText('Our Best Sellers')).toBeInTheDocument();
        expect(screen.getByText(/Explore our most popular products/i)).toBeInTheDocument();
    });

    it('renders loading states when data is loading', () => {
        mockUseTopCategories.mockReturnValue({ categories: [], loading: true, error: null });

        render(
            <MemoryRouter>
                <LandingPage />
            </MemoryRouter>
        );

        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('renders error states when there is an error', () => {
        mockUseTopCategories.mockReturnValue({ categories: [], loading: false, error: 'Error loading categories' });

        render(
            <MemoryRouter>
                <LandingPage />
            </MemoryRouter>
        );

        expect(screen.getByText('Error loading categories')).toBeInTheDocument();
    });

    it('renders all sections with their respective content', () => {
        render(
            <MemoryRouter>
                <LandingPage />
            </MemoryRouter>
        );

        expect(screen.getByText('Electronics')).toBeInTheDocument();
        expect(screen.getByText('Clothing')).toBeInTheDocument();

        const latestProductImages = screen.getAllByAltText(/left|center|right/);
        expect(latestProductImages).toHaveLength(3);

        expect(screen.getByText('Product 1')).toBeInTheDocument();
        expect(screen.getByText('Product 2')).toBeInTheDocument();
        expect(screen.getByText('$100')).toBeInTheDocument();
        expect(screen.getByText('$200')).toBeInTheDocument();
    });

    it('navigates to shop-list when Top Categories Shop All button is clicked', () => {
        render(
            <MemoryRouter>
                <LandingPage />
            </MemoryRouter>
        );

        const shopAllButtons = screen.getAllByText('Shop All');
        fireEvent.click(shopAllButtons[0]); 
        expect(mockNavigate).toHaveBeenCalledWith('/shop-list');
    });

    it('navigates to shop-list when Latest Arrivals Shop All button is clicked', () => {
        render(
            <MemoryRouter>
                <LandingPage />
            </MemoryRouter>
        );

        const shopAllButtons = screen.getAllByText('Shop All');
        fireEvent.click(shopAllButtons[1]); 
        expect(mockNavigate).toHaveBeenCalledWith('/shop-list');
    });

    it('navigates to shop-list when Best Sellers Shop All button is clicked', () => {
        render(
            <MemoryRouter>
                <LandingPage />
            </MemoryRouter>
        );

        const shopAllButtons = screen.getAllByText('Shop All');
        fireEvent.click(shopAllButtons[2]); 
        expect(mockNavigate).toHaveBeenCalledWith('/shop-list');
    });

    describe('Latest Arrivals Section', () => {
        it('shows loading spinner when latest products are loading', () => {
            mockUseLatestProducts.mockReturnValue({
                products: [],
                loading: true,
                error: null
            });

            render(
                <MemoryRouter>
                    <LandingPage />
                </MemoryRouter>
            );

            const loadingSpinner = screen.getByTestId('loading-spinner');
            expect(loadingSpinner).toBeInTheDocument();
        });

        it('shows error message when latest products fail to load', () => {
            mockUseLatestProducts.mockReturnValue({
                products: [],
                loading: false,
                error: 'Error loading latest products'
            });

            render(
                <MemoryRouter>
                    <LandingPage />
                </MemoryRouter>
            );

            expect(screen.getByText('Error loading latest products')).toBeInTheDocument();
        });

        it('renders StaggeredImageGrid with correct images when data is loaded', () => {
            const mockProducts = [
                { image: 'product1.jpg' },
                { image: 'product2.jpg' },
                { image: 'product3.jpg' }
            ];

            mockUseLatestProducts.mockReturnValue({
                products: mockProducts,
                loading: false,
                error: null
            });

            render(
                <MemoryRouter>
                    <LandingPage />
                </MemoryRouter>
            );

            const staggeredGrid = screen.getByTestId('staggered-grid');
            expect(staggeredGrid).toBeInTheDocument();

            const images = staggeredGrid.querySelectorAll('img');
            expect(images).toHaveLength(3);
            expect(images[0]).toHaveAttribute('src', 'product1.jpg');
            expect(images[1]).toHaveAttribute('src', 'product2.jpg');
            expect(images[2]).toHaveAttribute('src', 'product3.jpg');
        });
    });
});
