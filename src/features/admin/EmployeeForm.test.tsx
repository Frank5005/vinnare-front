import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EmployeeForm from './EmployeeForm';
import { getSecurityQuestions } from "../../services/authService";
import { createEmployee } from "../../services/adminService";
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import React from 'react';

jest.mock('../../services/adminService', () => ({
    createEmployee: jest.fn(),
}));

jest.mock('../../services/authService', () => ({
    getSecurityQuestions: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('EmployeeForm', () => {
    const mockQuestions = [
        { value: '0', label: 'WhatIsYourFavoriteColor' },
        { value: '1', label: 'WhatIsYourPetName' },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (getSecurityQuestions as jest.Mock).mockResolvedValue(mockQuestions);
    });

    const renderEmployeeForm = () => {
        return render(
            <BrowserRouter>
                <EmployeeForm />
            </BrowserRouter>
        );
    };

    it('renders the employee form with all fields', async () => {
        renderEmployeeForm();

        // Check if all form fields are rendered
        expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Repeat Password')).toBeInTheDocument();
        expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Security question/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Your answer/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Create employee/i })).toBeInTheDocument();
    });

    it('loads security questions on mount', async () => {
        renderEmployeeForm();
        await waitFor(() => {
            expect(getSecurityQuestions).toHaveBeenCalled();
        });
    });

    it('shows validation errors for invalid form submission', async () => {
        renderEmployeeForm();

        const submitButton = screen.getByRole('button', { name: /Create employee/i });
        fireEvent.click(submitButton);

        // Check for required field errors
        await waitFor(() => {
            expect(screen.getByText('Name is required')).toBeInTheDocument();
            expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
            expect(screen.getByText('Username is required')).toBeInTheDocument();
            expect(screen.getByText('Password must be at least 8 characters long')).toBeInTheDocument();
            expect(screen.getByText('Address is required')).toBeInTheDocument();
            expect(screen.getByText('Select a question')).toBeInTheDocument();
            expect(screen.getByText('Answer is required')).toBeInTheDocument();
        });
    });

    it('validates password confirmation match', async () => {
        renderEmployeeForm();

        await userEvent.type(screen.getByLabelText('Password'), 'StrongPass123!');
        await userEvent.type(screen.getByLabelText('Repeat Password'), 'DifferentPass123!');

        const submitButton = screen.getByRole('button', { name: /Create employee/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
        });
    });

    it('submits the form with valid data and navigates to homepage', async () => {
        (createEmployee as jest.Mock).mockResolvedValueOnce({});
        renderEmployeeForm();

        // Fill in the form with valid data
        await userEvent.type(screen.getByLabelText(/Full Name/i), 'John Doe');
        await userEvent.type(screen.getByLabelText(/Email/i), 'john@example.com');
        await userEvent.type(screen.getByLabelText(/Username/i), 'johndoe');
        await userEvent.type(screen.getByLabelText('Password'), 'StrongPass123!');
        await userEvent.type(screen.getByLabelText('Repeat Password'), 'StrongPass123!');
        await userEvent.type(screen.getByLabelText(/Address/i), '123 Main St');
        await userEvent.selectOptions(screen.getByLabelText(/Security question/i), '0');
        await userEvent.type(screen.getByLabelText(/Your answer/i), 'Blue');

        const submitButton = screen.getByRole('button', { name: /Create employee/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(createEmployee).toHaveBeenCalledWith({
                name: 'John Doe',
                email: 'john@example.com',
                username: 'johndoe',
                password: 'StrongPass123!',
                address: '123 Main St',
                securityQuestion: '0',
                role: "Seller",
                securityAnswer: 'Blue',
            });
            expect(mockNavigate).toHaveBeenCalledWith('/admin/homepage');
        });
    });

    it('handles creation error and displays error message', async () => {
        const errorMessage = 'An error occurred during creation';
        (createEmployee as jest.Mock).mockRejectedValueOnce({
            response: { data: { message: errorMessage } }
        });

        renderEmployeeForm();

        await userEvent.type(screen.getByLabelText(/Full Name/i), 'John Doe');
        await userEvent.type(screen.getByLabelText(/Email/i), 'john@example.com');
        await userEvent.type(screen.getByLabelText(/Username/i), 'johndoe');
        await userEvent.type(screen.getByLabelText('Password'), 'StrongPass123!');
        await userEvent.type(screen.getByLabelText('Repeat Password'), 'StrongPass123!');
        await userEvent.type(screen.getByLabelText(/Address/i), '123 Main St');
        await userEvent.selectOptions(screen.getByLabelText(/Security question/i), '0');
        await userEvent.type(screen.getByLabelText(/Your answer/i), 'Blue');

        const submitButton = screen.getByRole('button', { name: /Create employee/i });
        fireEvent.click(submitButton);

        const errorAlert = await screen.findByText(errorMessage);
        expect(errorAlert).toBeInTheDocument();
    });

    it('shows error message when security questions fail to load', async () => {
        (getSecurityQuestions as jest.Mock).mockRejectedValue(new Error('Failed to load questions'));
        render(
            <BrowserRouter>
                <EmployeeForm />
            </BrowserRouter>
        );
        await waitFor(() => {
            expect(screen.getByText('Error loading questions')).toBeInTheDocument();
        });
    });
});