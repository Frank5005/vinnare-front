import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignUpForm from './SignUpForm';
import { getSecurityQuestions, signup } from '../../../services/authService';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import React from 'react';

// Mock the auth service
jest.mock('../../../services/authService', () => ({
  getSecurityQuestions: jest.fn(),
  signup: jest.fn(),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('SignUpForm', () => {
  const mockQuestions = [
    { value: 'q1', label: 'What is your favorite color?' },
    { value: 'q2', label: 'What is your pet\'s name?' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (getSecurityQuestions as jest.Mock).mockResolvedValue(mockQuestions);
  });

  const renderSignUpForm = () => {
    return render(
      <BrowserRouter>
        <SignUpForm />
      </BrowserRouter>
    );
  };

  it('renders the sign up form with all fields', async () => {
    renderSignUpForm();

    // Check if all form fields are rendered
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/repeat password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/security question/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/your answer/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('loads security questions on mount', async () => {
    renderSignUpForm();
    await waitFor(() => {
      expect(getSecurityQuestions).toHaveBeenCalled();
    });
  });

  it('shows validation errors for invalid form submission', async () => {
    renderSignUpForm();

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(submitButton);

    // Check for required field errors
    await waitFor(() => {
      const errorMessages = screen.getAllByText(/required/i);
      expect(errorMessages).toHaveLength(4); // name, username, address, and answer required
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
      expect(screen.getByText(/string must contain at least 8 character\(s\)/i)).toBeInTheDocument();
      expect(screen.getByText(/select a question/i)).toBeInTheDocument();
    });
  });

  it('validates password requirements', async () => {
    renderSignUpForm();

    const passwordInput = screen.getByLabelText(/^password$/i);
    await userEvent.type(passwordInput, 'weak');

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/string must contain at least 8 character\(s\)/i)).toBeInTheDocument();
    });
  });

  it('validates password confirmation match', async () => {
    renderSignUpForm();

    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/repeat password/i);

    await userEvent.type(passwordInput, 'StrongPass123!');
    await userEvent.type(confirmPasswordInput, 'DifferentPass123!');

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('submits the form with valid data and navigates to login', async () => {
    (signup as jest.Mock).mockResolvedValueOnce({});
    renderSignUpForm();

    // Fill in the form with valid data
    await userEvent.type(screen.getByLabelText(/full name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/username/i), 'johndoe');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'StrongPass123!');
    await userEvent.type(screen.getByLabelText(/repeat password/i), 'StrongPass123!');
    await userEvent.type(screen.getByLabelText(/address/i), '123 Main St');
    await userEvent.selectOptions(screen.getByLabelText(/security question/i), 'q1');
    await userEvent.type(screen.getByLabelText(/your answer/i), 'Blue');

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(signup).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        username: 'johndoe',
        password: 'StrongPass123!',
        address: '123 Main St',
        securityQuestion: 'q1',
        securityAnswer: 'Blue',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('handles signup error and displays error message', async () => {
    const errorMessage = 'Email already exists';
    (signup as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: errorMessage } }
    });

    renderSignUpForm();

    await userEvent.type(screen.getByLabelText(/full name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/username/i), 'johndoe');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'StrongPass123!');
    await userEvent.type(screen.getByLabelText(/repeat password/i), 'StrongPass123!');
    await userEvent.type(screen.getByLabelText(/address/i), '123 Main St');
    await userEvent.selectOptions(screen.getByLabelText(/security question/i), 'q1');
    await userEvent.type(screen.getByLabelText(/your answer/i), 'Blue');

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });


}); 