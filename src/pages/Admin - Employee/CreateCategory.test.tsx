import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateCategory from './CreateCategory';
import React from 'react';

jest.mock('../../components/organisms/AdminHeader', () => () => <div data-testid="admin-header">Header</div>);

jest.mock('../../layouts/FormCardLayout', () => ({ title, children }: any) => (
  <div data-testid="form-card-layout">
    <div>{title}</div>
    {children}
  </div>
));

jest.mock('../../components/atoms/InputField', () => ({
    __esModule: true,
    default: ({ label, name, value, onChange, required }: { label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean }) => (
      <input
        aria-label={label}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      />
    ),
  }));

jest.mock('../../components/atoms/Button', () => ({ children, ...props }: any) => (
  <button {...props}>{children}</button>
));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockPost = jest.fn();
jest.mock('../../services/api', () => ({
  post: (...args: any[]) => mockPost(...args),
}));

describe('CreateCategory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders the form and header', () => {
    render(<CreateCategory />);
    expect(screen.getByTestId('admin-header')).toBeInTheDocument();
    expect(screen.getByTestId('form-card-layout')).toBeInTheDocument();
    expect(screen.getByLabelText('Category Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Image URL')).toBeInTheDocument();
  });

  it('shows error if username is missing', async () => {
    render(<CreateCategory />);
    fireEvent.change(screen.getByLabelText('Category Name'), { target: { value: 'TestCat' } });
    fireEvent.change(screen.getByLabelText('Image URL'), { target: { value: 'http://img' } });
    fireEvent.click(screen.getByText(/add/i));
    await waitFor(() => {
      expect(screen.getByText(/no username found/i)).toBeInTheDocument();
    });
  });

  it('submits the form and shows success', async () => {
    localStorage.setItem('userName', 'testuser');
    mockPost.mockResolvedValueOnce({ data: { message: 'Created!' } });
    render(<CreateCategory />);
    fireEvent.change(screen.getByLabelText('Category Name'), { target: { value: 'TestCat' } });
    fireEvent.change(screen.getByLabelText('Image URL'), { target: { value: 'http://img' } });
    fireEvent.click(screen.getByText(/add/i));
    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/api/category/create', {
        name: 'TestCat',
        imageUrl: 'http://img',
        username: 'testuser'
      });
      expect(screen.getByText('Created!')).toBeInTheDocument();
    });
  });

  it('shows error if api fails', async () => {
    localStorage.setItem('userName', 'testuser');
    mockPost.mockRejectedValueOnce({ message: 'API error' });
    render(<CreateCategory />);
    fireEvent.change(screen.getByLabelText('Category Name'), { target: { value: 'TestCat' } });
    fireEvent.change(screen.getByLabelText('Image URL'), { target: { value: 'http://img' } });
    fireEvent.click(screen.getByText(/add/i));
    await waitFor(() => {
      expect(screen.getByText(/api error/i)).toBeInTheDocument();
    });
  });
});