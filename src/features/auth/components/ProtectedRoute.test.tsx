import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

const MockChild = () => <div>Protected Content</div>;

describe('ProtectedRoute', () => {
  const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
    });
  });

  const renderWithRouter = (initialRoute: string, allowedRoles: string[]) => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={allowedRoles}>
                <MockChild />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/unauthorized" element={<div>Unauthorized Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders children when user is authenticated and has correct role', () => {
    mockLocalStorage.getItem
      .mockImplementation((key) => {
        if (key === 'token') return 'fake-token';
        if (key === 'userRole') return 'admin';
        return null;
      });

    renderWithRouter('/', ['admin']);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    renderWithRouter('/', ['admin']);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('redirects to unauthorized when user has incorrect role', () => {
    mockLocalStorage.getItem
      .mockImplementation((key) => {
        if (key === 'token') return 'fake-token';
        if (key === 'userRole') return 'user';
        return null;
      });

    renderWithRouter('/', ['admin']);
    expect(screen.getByText('Unauthorized Page')).toBeInTheDocument();
  });

  it('allows access when user role is in allowedRoles array', () => {
    mockLocalStorage.getItem
      .mockImplementation((key) => {
        if (key === 'token') return 'fake-token';
        if (key === 'userRole') return 'editor';
        return null;
      });

    renderWithRouter('/', ['admin', 'editor']);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('handles multiple allowed roles correctly', () => {
    mockLocalStorage.getItem
      .mockImplementation((key) => {
        if (key === 'token') return 'fake-token';
        if (key === 'userRole') return 'viewer';
        return null;
      });

    renderWithRouter('/', ['admin', 'editor', 'viewer']);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
