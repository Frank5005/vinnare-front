import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import JobsList from './JobsList';
import React from 'react';
import { Job } from '../../types/Job';
import { BrowserRouter } from 'react-router-dom';
import { useJobsList } from '../../hooks/useJobsList';

jest.mock('../../components/organisms/AdminHeader', () => () => <div data-testid="admin-header">Header</div>);

jest.mock('../../components/organisms/DataTable', () => {
    const actual = jest.requireActual('../../components/organisms/DataTable');
    return {
        ...actual,
        DataTable: actual.DataTable,
    };
});

const mockJobs: Job[] = [
    {
        id: 1,
        associatedId: 15,
        categoryName: 'Electronics',
        productName: "null",
        creatorName: 'John Smith',
        date: '2025-05-24T16:50:58.357Z',
        type: 'Category',
        operation: 'Create'
    },
    {
        id: 2,
        associatedId: 16,
        categoryName: 'Home Appliances',
        productName: "null",
        creatorName: 'John Smith',
        date: '2025-05-26T20:10:57.037Z',
        type: 'Category',
        operation: 'Delete'
    },
    {
        id: 3,
        associatedId: 34,
        categoryName: "null",
        productName: 'Samsung TV',
        creatorName: 'Jane Doe',
        date: '2025-05-14T21:00:00.000Z',
        type: 'Product',
        operation: 'Create'
    },
    {
        id: 4,
        associatedId: 35,
        categoryName: "null",
        productName: 'iPhone 14',
        creatorName: 'Jane Doe',
        date: '2025-05-03T22:15:12.000Z',
        type: 'Product',
        operation: 'Delete'
    }
];
let loading = false;
let error: string | null = null;
jest.mock('../../hooks/useJobsList', () => ({
    useJobsList: () => ({
        jobs: mockJobs,
        loading,
        error
    })
}));

describe('JobsList', () => {
    beforeEach(() => {
        loading = false;
        error = null;
        jest.clearAllMocks();
    });

    it('renders the header and title', () => {
        render(<JobsList />);
        expect(screen.getByTestId('admin-header')).toBeInTheDocument();
        expect(screen.getByText(/Jobs List/i)).toBeInTheDocument();
    });

    it('renders the jobs', () => {
        render(<JobsList />);
        expect(screen.getByText('iPhone 14')).toBeInTheDocument();
        expect(screen.getByText('Home Appliances')).toBeInTheDocument();
        expect(screen.getByText('Samsung TV')).toBeInTheDocument();
        expect(screen.getByText('Electronics')).toBeInTheDocument();
    });

    it('shows loading state', () => {
        loading = true;
        render(<JobsList />);
        expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    });

    it('shows error state', () => {
        error = 'Error loading jobs';
        //error = 'Error fetching jobs';
        render(<JobsList />);
        expect(screen.getByText(/Error loading jobs/i)).toBeInTheDocument();
    });

    it('filters jobs to show only last 7 days when selected', async () => {
        render(<JobsList />);

        const select = screen.getByTitle(/Date filter/i);
        fireEvent.change(select, { target: { value: '7' } });

        await waitFor(() => {
            expect(screen.getByText('Electronics')).toBeInTheDocument();
            expect(screen.getByText('Home Appliances')).toBeInTheDocument();
        });
    });

    it('shows all users when filter is "all"', async () => {
        render(<JobsList />);

        const select = screen.getByTitle(/date filter/i);
        fireEvent.change(select, { target: { value: 'all' } });

        await waitFor(() => {
            expect(screen.getByText('Electronics')).toBeInTheDocument();
            expect(screen.getByText('Home Appliances')).toBeInTheDocument();
            expect(screen.getByText('Samsung TV')).toBeInTheDocument();
            expect(screen.getByText('iPhone 14')).toBeInTheDocument();
        });
    });

});
