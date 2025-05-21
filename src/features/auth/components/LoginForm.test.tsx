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

// Mock de useNavigate y useAuth para evitar navegación real y login real
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  Link: ({ children }: any) => <span>{children}</span>,
}));
jest.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({ login: jest.fn() }),
}));
jest.mock('../../../services/authService', () => ({
  login: jest.fn(() => Promise.resolve({ token: 'fake', username: 'user', email: 'mail', changePassword: false })),
  getRoleFromToken: () => 'Admin',
}));

describe('LoginForm', () => {
  it('renders all fields and button', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /password/i })).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });

  it('shows validation errors on empty submit', async () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByText(/login/i));
    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/password required/i)).toBeInTheDocument();
    });
  });

  it('calls login service on valid submit', async () => {
    const { login } = require('../../../services/authService');
    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@mail.com' } });
    fireEvent.change(screen.getByRole('textbox', { name: /password/i }), { target: { value: '123456' } });
    fireEvent.click(screen.getByText(/login/i));
    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: 'test@mail.com',
        password: '123456',
        remember: false,
      });
    });
  });
});