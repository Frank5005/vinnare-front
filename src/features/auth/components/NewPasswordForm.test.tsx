import React from 'react';
import NewPasswordForm from './NewPasswordForm';
import { BrowserRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { resetPassword } from '../../../services/authService';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Mock the auth service
jest.mock('../../../services/authService', () => ({
    resetPassword: jest.fn(),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('NewPasswordForm', () => {

    /*
    beforeEach(() => {
        localStorage.setItem('resetToken', '123abc');
    });
    */

    const renderNewPasswordForm = () => {
        return render(
            <BrowserRouter>
                <NewPasswordForm />
            </BrowserRouter>
        );
    };

    it('renders the new password form with both fields', async () => {
        renderNewPasswordForm();

        // Check if both fields are rendered
        expect(screen.getByLabelText(/^New Password$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Confirm your Password/i)).toBeInTheDocument();
    });

    it('shows error when reset token is missing', async () => {
        localStorage.removeItem('resetToken');
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => { });
        renderNewPasswordForm();

        await userEvent.type(screen.getByLabelText(/^New Password$/i), 'StrongPass123!');
        await userEvent.type(screen.getByLabelText(/Confirm your Password/i), 'StrongPass123!');

        const submitButton = screen.getByRole('button', { name: /reset/i });
        fireEvent.click(submitButton);

        expect(alertMock).toHaveBeenCalledWith('Missing reset token.');

        alertMock.mockRestore();
    });

    it('shows validation errors for invalid form submission', async () => {
        renderNewPasswordForm();

        const submitButton = screen.getByRole('button', { name: /reset/i });
        fireEvent.click(submitButton);

        // Check for required field errors
        await waitFor(() => {
            expect(screen.getByText(/string must contain at least 8 character\(s\)/i)).toBeInTheDocument();
        });
    });

    it('validates password requirements', async () => {
        renderNewPasswordForm();

        const passwordInput = screen.getByLabelText(/^New Password$/i);
        await userEvent.type(passwordInput, 'weak');

        const submitButton = screen.getByRole('button', { name: /reset/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/string must contain at least 8 character\(s\)/i)).toBeInTheDocument();
        });
    });

    it('shows error when password and confirmation do not match', async () => {
        localStorage.setItem('resetToken', '123abc');
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => { });
        renderNewPasswordForm();
        //localStorage.setItem('resetToken', '123abc');

        await userEvent.type(screen.getByLabelText(/^New Password$/i), 'StrongPass123!');
        await userEvent.type(screen.getByLabelText(/Confirm your Password/i), 'DifferentPass123!');

        const submitButton = screen.getByRole('button', { name: /reset/i });
        fireEvent.click(submitButton);

        expect(alertMock).toHaveBeenCalledWith('Passwords do not match.');
        alertMock.mockRestore();
    });

    it('submits the form with valid data and navigates to login', async () => {
        localStorage.setItem('resetToken', '123abc');
        (resetPassword as jest.Mock).mockResolvedValueOnce({});
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => { });
        renderNewPasswordForm();

        // Fill in the form with valid data
        await userEvent.type(screen.getByLabelText(/^New Password$/i), 'StrongPass123!');
        await userEvent.type(screen.getByLabelText(/Confirm your Password/i), 'StrongPass123!');

        const submitButton = screen.getByRole('button', { name: /reset/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(alertMock).toHaveBeenCalledWith('Password updated successfully.');
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });
        alertMock.mockRestore();
    });

    it('handles new password error and displays error message', async () => {
        localStorage.setItem('resetToken', '123abc');
        //clcconst errorMessage = 'Error updating password';
        (resetPassword as jest.Mock).mockRejectedValueOnce(
            new Error("Error updating password")
        );

        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => { });

        renderNewPasswordForm();
        await userEvent.type(screen.getByLabelText(/^New Password$/i), 'StrongPass123!');
        await userEvent.type(screen.getByLabelText(/Confirm your Password/i), 'StrongPass123!');

        const submitButton = screen.getByRole('button', { name: /reset/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(alertMock).toHaveBeenCalledWith('Error updating password. Please try again.');
        });

        alertMock.mockRestore();
    });
});

