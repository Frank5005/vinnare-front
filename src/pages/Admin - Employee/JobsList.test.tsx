import { render, screen, fireEvent } from '@testing-library/react';
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

jest.mock('../../components/molecules/OrderDateFilter', () => ({ value, onChange }: any) => (
    <select title="order-data-filter" data-testid="order-date-filter" value={value} onChange={e => onChange(e.target.value)}>
        <option value="7">Last 7 Days</option>
        <option value="all">All</option>
    </select>
));

const mockJobs: Job[] = [
    {
        id: 1,
        associatedId: 15,
        categoryName: 'Electronics',
        productName: "null",
        creatorName: 'John Smith',
        date: '2025-05-28T16:50:58.357Z',
        type: 'Category',
        operation: 'Create'
    },
    {
        id: 2,
        associatedId: 16,
        categoryName: 'Home Appliances',
        productName: "null",
        creatorName: 'John Smith',
        date: '2025-05-28T20:10:57.037Z',
        type: 'Category',
        operation: 'Delete'
    },
    {
        id: 3,
        associatedId: 34,
        categoryName: "null",
        productName: 'Samsung TV',
        creatorName: 'Jane Doe',
        date: '2025-05-28T21:00:00.000Z',
        type: 'Product',
        operation: 'Create'
    },
    {
        id: 4,
        associatedId: 35,
        categoryName: "null",
        productName: 'iPhone 14',
        creatorName: 'Jane Doe',
        date: '2025-05-28T22:15:12.000Z',
        type: 'Product',
        operation: 'Delete'
    }
];
let loading = false;
let error: string | null = null;
jest.mock('../../hooks/useJobsList');
const mockedUseJobsList = useJobsList as jest.Mock;

describe('JobsList', () => {
    beforeEach(() => {
        mockedUseJobsList.mockReturnValue({
            loading: false,
            error: '',
            jobId: null,
            filteredJobs: mockJobs,
            dateFilter: '',
            isAccepting: false,
            isDeclining: false,
            handleAccept: jest.fn(),
            handleReject: jest.fn(),
            setDateFilter: jest.fn()
        });
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
        mockedUseJobsList.mockReturnValueOnce({
            ...mockedUseJobsList(),
            loading: true
        });
        render(<JobsList />);
        expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    });

    it('shows error state', () => {
        mockedUseJobsList.mockReturnValueOnce({
            ...mockedUseJobsList(),
            error: 'Error loading jobs'
        });
        render(<JobsList />);
        expect(screen.getByText(/Error loading jobs/i)).toBeInTheDocument();
    });

    it('filters jobs by date', () => {
        render(<JobsList />);
        const select = screen.getByTestId('order-date-filter');
        fireEvent.change(select, { target: { value: 'all' } });
        expect(select).toHaveValue('all');
    });

    it('calls handleAccept when Accept is clicked', () => {
        const handleAccept = jest.fn();
        mockedUseJobsList.mockReturnValueOnce({
            ...mockedUseJobsList(),
            handleAccept
        });
        render(<JobsList />);
        const acceptButton = screen.getAllByRole('button', { name: /Approve/i })[0];
        fireEvent.click(acceptButton);
        expect(handleAccept).toHaveBeenCalled();
    });

    it('calls handleReject when Decline is clicked', () => {
        const handleReject = jest.fn();
        mockedUseJobsList.mockReturnValueOnce({
            ...mockedUseJobsList(),
            handleReject
        });
        render(<JobsList />);
        const declineButton = screen.getAllByRole('button', { name: /Decline/i })[0];
        fireEvent.click(declineButton);
        expect(handleReject).toHaveBeenCalled();
    });

});
