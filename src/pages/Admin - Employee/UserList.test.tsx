import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import UserList from './UserList';
import React from 'react';
import { User } from '../../types/User';

jest.mock('../../components/organisms/AdminHeader', () => () => <div data-testid="admin-header">Header</div>);

jest.mock('../../components/organisms/DataTable', () => {
    const actual = jest.requireActual('../../components/organisms/DataTable');
    return {
        ...actual,
        DataTable: actual.DataTable,
    };
});

const mockUsers: User[] = [
    {
        id: '3f2504e0-4f89-11d3-9a0c-0305e82c3301',
        username: 'johndoe',
        email: 'johndoe@example.com',
        role: 'Admin',
        date: '2025-05-10T12:00:00.000000+00:00',
    },
    {
        id: '1c6e9d3a-8156-4b21-8c76-749ef9ef1e57',
        username: 'janedoe',
        email: 'janedoe@example.com',
        role: 'Shopper',
        date: '2025-05-12T15:30:00.000000+00:00',
    },
    {
        id: '5b7b56f7-9248-4e87-90cd-df0c3a4c2369',
        username: 'franksmith',
        email: 'frank.smith@example.com',
        role: 'Seller',
        date: '2025-05-26T02:58:02.626150+00:00',
    },
    {
        id: 'dc76d4e9-96d2-4e2b-a3e5-118df2780d33',
        username: 'lucywhite',
        email: 'lucy.white@example.com',
        role: 'Shopper',
        date: '2025-05-25T23:09:01.822283+00:00',
    },
];

let loading = false;
let error: string | null = null;
jest.mock('../../hooks/useAllUsers', () => ({
    useAllUsers: () => ({
        users: mockUsers,
        loading,
        error
    })
}));

describe('UserList', () => {
    beforeEach(() => {
        loading = false;
        error = null;
        jest.clearAllMocks();
    });

    it('renders the header and title', () => {
        render(<UserList />);
        expect(screen.getByTestId('admin-header')).toBeInTheDocument();
        expect(screen.getByText(/Users List/i)).toBeInTheDocument();
    });

    it('renders the users', () => {
        render(<UserList />);
        //expect(screen.getByText('johndoe')).toBeInTheDocument();
        //expect(screen.getByText('janedoe')).toBeInTheDocument();
        expect(screen.getByText('franksmith')).toBeInTheDocument();
        expect(screen.getByText('lucywhite')).toBeInTheDocument();
    });
    it('shows loading state', () => {
        loading = true;
        render(<UserList />);
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
    it('shows error state', () => {
        error = 'Error fetching users';
        render(<UserList />);
        expect(screen.getByText('Error fetching users')).toBeInTheDocument();
    });

    it('filters users to show only last 7 days when selected', async () => {
        render(<UserList />);

        const select = screen.getByTitle(/Date filter/i);
        fireEvent.change(select, { target: { value: '7' } });

        await waitFor(() => {
            expect(screen.getByText('franksmith')).toBeInTheDocument();
            expect(screen.getByText('lucywhite')).toBeInTheDocument();
        });
    });

    it('shows all users when filter is "all"', async () => {
        render(<UserList />);

        const select = screen.getByTitle(/date filter/i);
        fireEvent.change(select, { target: { value: 'all' } });

        await waitFor(() => {
            expect(screen.getByText('johndoe')).toBeInTheDocument();
            expect(screen.getByText('janedoe')).toBeInTheDocument();
            expect(screen.getByText('franksmith')).toBeInTheDocument();
            expect(screen.getByText('lucywhite')).toBeInTheDocument();
        });
    });
});