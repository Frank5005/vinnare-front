import { render, screen, fireEvent } from '@testing-library/react';
import AdminHeader from './AdminHeader';
import React from 'react';

const mockLogout = jest.fn();
const mockUserName = "TestUser";
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    userName: mockUserName,
    logout: mockLogout,
  }),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('AdminHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders the username', () => {
    render(<AdminHeader />);
    expect(screen.getByText(mockUserName)).toBeInTheDocument();
  });

  it('calls logout and navigates on logout button click', () => {
    render(<AdminHeader />);
    const logoutButton = screen.getByText(/logout/i);
    fireEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('navigates to /admin/homepage when title is clicked', () => {
    render(<AdminHeader />);
    const title = screen.getByText(/Tech Trend Emporium/i);
    fireEvent.click(title);
    expect(mockNavigate).toHaveBeenCalledWith('/admin/homepage');
  });

  it('renders the Employee Portal badge', () => {
    render(<AdminHeader />);
    expect(screen.getByText(/Employee Portal/i)).toBeInTheDocument();
  });
});