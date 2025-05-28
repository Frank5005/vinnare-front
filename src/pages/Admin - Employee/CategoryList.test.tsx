import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import CategoryList from './CategoryList';
import React from 'react';
import api from '../../services/api';

jest.mock('../../components/organisms/AdminHeader', () => () => <div data-testid="admin-header">Header</div>);

jest.mock('../../components/organisms/DataTable', () => {
    const actual = jest.requireActual('../../components/organisms/DataTable');
    return {
        ...actual,
        DataTable: actual.DataTable,
    };
});

jest.mock('../../services/api', () => ({
    delete: jest.fn(),
}));

const mockCategories = [
    { id: 1, name: 'Cat1', imageUrl: '', approved: true },
    { id: 2, name: 'Cat2', imageUrl: '', approved: false }
];
let loading = false;
let error: string | null = null;
let currentCategories = [...mockCategories];

jest.mock('../../hooks/useAllCategories', () => ({
    useAllCategories: () => ({
        categories: currentCategories,
        loading,
        error
    })
}));

describe('CategoryList', () => {
    beforeEach(() => {
        loading = false;
        error = null;
        currentCategories = [...mockCategories];
        jest.clearAllMocks();
    });

    it('renders the header and title', () => {
        render(<CategoryList />);
        expect(screen.getByTestId('admin-header')).toBeInTheDocument();
        expect(screen.getByText(/Category List/i)).toBeInTheDocument();
    });

    it('renders the categories and buttons', () => {
        render(<CategoryList />);
        expect(screen.getByText('Cat1')).toBeInTheDocument();
        expect(screen.getByText('Cat2')).toBeInTheDocument();
        expect((screen.getAllByLabelText('Edit'))[0]).toBeInTheDocument();
        expect((screen.getAllByLabelText('Delete'))[0]).toBeInTheDocument();
        expect(screen.getByTestId('approved-1')).toHaveTextContent('✅');
        expect(screen.getByTestId('approved-2')).toHaveTextContent('❌');
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('shows loading state', () => {
        loading = true;
        render(<CategoryList />);
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('shows error state', () => {
        error = 'Error loading categories';
        render(<CategoryList />);
        expect(screen.getByText('Error loading categories')).toBeInTheDocument();
    });

    it('handles edit and save', () => {
        render(<CategoryList />);
        const row = screen.getByText('Cat1').closest('tr');
        if (row) {
            const editButton = within(row).getByLabelText('Edit');
            if (editButton) {
                fireEvent.click(editButton);
                fireEvent.change(within(row).getByLabelText('IMAGE'), { target: { value: 'https://example.com/image.jpg' } });
                fireEvent.click(within(row).getByLabelText('Save'));
            }
        }
        const updatedRow = screen.getByText('Cat1').closest('tr');
        if (updatedRow) {
            const imageCell = within(updatedRow).getByRole('img');
            expect(imageCell).toHaveAttribute('src', 'https://example.com/image.jpg');
        }
    });

    it('updates categories when initialCategories changes', async () => {
        render(<CategoryList />);
        expect(screen.getByText('Cat1')).toBeInTheDocument();
        currentCategories.length = 0;
        currentCategories.push(
          { id: 1, name: 'Cat1', imageUrl: '', approved: true },
          { id: 2, name: 'Cat2', imageUrl: '', approved: false },
          { id: 3, name: 'Cat3', imageUrl: '', approved: true }
        );
        render(<CategoryList />);
        await waitFor(() => {
            expect(screen.getByText('Cat3')).toBeInTheDocument();
        });
    });

    it('can cancel edit', () => {
        render(<CategoryList />);
        const row = screen.getByText('Cat1').closest('tr');
        if (row) {
            const editButton = within(row).getByLabelText('Edit');
            fireEvent.click(editButton);
            const cancelButton = within(row).getByLabelText('Cancel');
            fireEvent.click(cancelButton);
            expect(within(row).queryByLabelText('IMAGE')).toBeNull();
        }
    });

    it('shows error if delete fails', async () => {
        (api.delete as jest.Mock).mockRejectedValueOnce({ response: { data: { title: 'Failed to delete category. Please try again.' } } });
        render(<CategoryList />);
        const row = screen.getByText('Cat1').closest('tr');
        if (row) {
            const deleteButton = within(row).getByLabelText('Delete');
            fireEvent.click(deleteButton);
            await waitFor(() => {
                expect(screen.getByText('Failed to delete category. Please try again.')).toBeInTheDocument();
            });
        }
    });

    
    it('deletes a category successfully', async () => {
        localStorage.setItem('userName', 'testuser');
        localStorage.setItem('userRole', 'Admin');
        (api.delete as jest.Mock).mockResolvedValueOnce({ status: 200 });
        render(<CategoryList />);
        const row = screen.getByText('Cat1').closest('tr');
        if (row) {
            const deleteButton = within(row).getByLabelText('Delete');
            fireEvent.click(deleteButton);
            currentCategories = currentCategories.filter(cat => cat.id !== 1);
            await waitFor(() => {
                expect(api.delete).toHaveBeenCalledWith('/api/category/1', {
                    headers: {
                        'username': 'testuser'
                    }
                });
                expect(screen.queryByText('Cat1')).not.toBeInTheDocument();
            });
        }
    });

});