import { TextEncoder, TextDecoder } from 'util';
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder as any;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder as any;
}
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from './LoginForm';
import React from 'react';
import { login, getRoleFromToken } from '../../../services/authService';

// Mock de useNavigate y useAuth para evitar navegación real y login real
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Link: ({ children }: any) => <span>{children}</span>,
}));

const mockLoginContext = jest.fn();
jest.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({ login: mockLoginContext }),
}));

jest.mock('../../../services/authService', () => ({
  login: jest.fn(),
  getRoleFromToken: jest.fn(),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (login as jest.Mock).mockReset();
    (getRoleFromToken as jest.Mock).mockReset();
    mockNavigate.mockReset();
    mockLoginContext.mockReset();
  });

  it('renders all fields and button', () => {
    render(<LoginForm />);
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByText(/please enter your credentials to log in/i)).toBeInTheDocument();
  
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
  
    expect(screen.getByLabelText(/toggle password visibility/i)).toBeInTheDocument();
  
    expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();
  
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
  
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });

  it('shows validation errors on empty submit', async () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByText(/login/i));
    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/password required/i)).toBeInTheDocument();
    });
  });

  it('handles successful login for Admin role', async () => {
    const mockResponse = {
      token: 'Bearer test-token',
      username: 'testuser',
      email: 'test@example.com',
      changePassword: false
    };

    (login as jest.Mock).mockResolvedValue(mockResponse);
    (getRoleFromToken as jest.Mock).mockReturnValue('Admin');

    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText(/login/i));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        remember: false,
      });
      expect(mockLoginContext).toHaveBeenCalledWith('testuser');
      expect(mockNavigate).toHaveBeenCalledWith('/admin/homepage');
    });
  });

  it('handles successful login for Shopper role', async () => {
    const mockResponse = {
      token: 'Bearer test-token',
      username: 'testuser',
      email: 'test@example.com',
      changePassword: false
    };

    (login as jest.Mock).mockResolvedValue(mockResponse);
    (getRoleFromToken as jest.Mock).mockReturnValue('Shopper');

    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText(/login/i));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/shop-list');
    });
  });

  it('handles successful login for Seller role with password change required', async () => {
    const mockResponse = {
      token: 'Bearer test-token',
      username: 'testuser',
      email: 'test@example.com',
      changePassword: true
    };

    (login as jest.Mock).mockResolvedValue(mockResponse);
    (getRoleFromToken as jest.Mock).mockReturnValue('Seller');

    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText(/login/i));

    await waitFor(() => {
      expect(localStorage.getItem('resetToken')).toBe('test-token');
      expect(mockNavigate).toHaveBeenCalledWith('/new-password');
    });
  });

  it('handles successful login for Seller role without password change', async () => {
    const mockResponse = {
      token: 'Bearer test-token',
      username: 'testuser',
      email: 'test@example.com',
      changePassword: false
    };

    (login as jest.Mock).mockResolvedValue(mockResponse);
    (getRoleFromToken as jest.Mock).mockReturnValue('Seller');

    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText(/login/i));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin/homepage');
    });
  });

  it('handles login error with 401 status', async () => {
    const mockError = {
      response: {
        status: 401,
        data: 'Invalid credentials'
      }
    };

    (login as jest.Mock).mockRejectedValue(mockError);
    const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByText(/login/i));

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Invalid username or password. Please try again.');
    });

    mockAlert.mockRestore();
  });

  it('handles other login errors', async () => {
    const mockError = {
      message: 'Network error'
    };

    (login as jest.Mock).mockRejectedValue(mockError);
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText(/login/i));

    await waitFor(() => {
      expect(mockConsoleError).toHaveBeenCalledWith('Login error:', 'Network error');
    });

    mockConsoleError.mockRestore();
  });

  it('navigates to forgot password page', () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByText(/forgot password/i));
    expect(mockNavigate).toHaveBeenCalledWith('/forgot-password');
  });
});