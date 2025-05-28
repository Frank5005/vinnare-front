import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { getSecurityQuestions, verifyEmail } from '../../../services/authService';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import React from 'react';
import ForgotPasswordForm from './ForgotPasswordForm';

// Mock the auth service
jest.mock('../../../services/authService', () => ({
    getSecurityQuestions: jest.fn(),
    verifyEmail: jest.fn(),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('ForgotPasswordForm', () => {
    const mockQuestions = [
        { value: '0', label: 'WhatIsYourFavoriteColor' },
        { value: '1', label: 'WhatIsYourPetName' },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (getSecurityQuestions as jest.Mock).mockResolvedValue(mockQuestions);
    });

    const renderForgotForm = () => {
        return render(
            <BrowserRouter>
                <ForgotPasswordForm />
            </BrowserRouter>
        );
    };

    it('renders the forgot password form with all fields', async () => {
        renderForgotForm();

        // Check if all form fields are rendered
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Security Question/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Question answer/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
    });

    it('loads security questions on mount', async () => {
        renderForgotForm();
        await waitFor(() => {
            expect(getSecurityQuestions).toHaveBeenCalled();
        });
    });

    it('shows validation errors for invalid form submission', async () => {
        renderForgotForm();

        const submitButton = screen.getByRole('button', { name: /reset/i });
        fireEvent.click(submitButton);

        // Check for required field errors
        await waitFor(() => {
            expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
            expect(screen.getByText(/Security question required/i)).toBeInTheDocument();
            expect(screen.getByText(/Security answer required/i)).toBeInTheDocument();
        });
    });

    //Failing
    it('submits the form with valid data and navigates to new password', async () => {
        (verifyEmail as jest.Mock).mockResolvedValueOnce({});
        renderForgotForm();

        // Fill in the form with valid data
        await userEvent.type(screen.getByLabelText(/Email/i), 'john@example.com');
        await userEvent.selectOptions(screen.getByLabelText(/Security Question/i), '0');
        await userEvent.type(screen.getByLabelText(/Question answer/i), 'Blue');

        const submitButton = screen.getByRole('button', { name: /reset/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(verifyEmail).toHaveBeenCalledWith('john@example.com', '0', 'Blue');
            expect(mockNavigate).toHaveBeenCalledWith('/new-password');
        });
    });

    it('handles forgot password error and displays error message', async () => {
        const errorMessage = 'Verification failed. Please check your info and try again.';
        (verifyEmail as jest.Mock).mockRejectedValueOnce({
            response: { data: { message: errorMessage } }
        });

        renderForgotForm();
        await userEvent.type(screen.getByLabelText(/Email/i), 'john@example.com');
        await userEvent.selectOptions(screen.getByLabelText(/Security Question/i), '0');
        await userEvent.type(screen.getByLabelText(/Question answer/i), 'Blue');

        const submitButton = screen.getByRole('button', { name: /reset/i });
        fireEvent.click(submitButton);

        const errorAlert = await screen.findByText(errorMessage);
        expect(errorAlert).toBeInTheDocument();
    });

    it('shows error message when security questions fail to load', async () => {
        (getSecurityQuestions as jest.Mock).mockRejectedValue(new Error('Failed to load questions'));
        render(
            <BrowserRouter>
                <ForgotPasswordForm />
            </BrowserRouter>
        );
        const errorMessage = await screen.findByText(/Error loading questions/i);
        expect(errorMessage).toBeInTheDocument();
    });
});