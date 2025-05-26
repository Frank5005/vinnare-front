import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

const TestComponent = () => {
    const { isLoggedIn, userName, login, logout } = useAuth();
    return (
        <div>
            <div data-testid="login-status">{isLoggedIn ? 'logged-in' : 'logged-out'}</div>
            <div data-testid="user-name">{userName}</div>
            <button onClick={() => login('testUser')} data-testid="login-button">Login</button>
            <button onClick={logout} data-testid="logout-button">Logout</button>
        </div>
    );
};

describe('AuthContext', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('provides initial logged out state', () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(screen.getByTestId('login-status')).toHaveTextContent('logged-out');
        expect(screen.getByTestId('user-name')).toHaveTextContent('');
    });

    it('loads user data from localStorage on mount', () => {
        mockLocalStorage.getItem.mockReturnValue('storedUser');
        
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(mockLocalStorage.getItem).toHaveBeenCalledWith('userName');
        expect(screen.getByTestId('login-status')).toHaveTextContent('logged-in');
        expect(screen.getByTestId('user-name')).toHaveTextContent('storedUser');
    });

    it('handles login correctly', () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        act(() => {
            screen.getByTestId('login-button').click();
        });

        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('userName', 'testUser');
        expect(screen.getByTestId('login-status')).toHaveTextContent('logged-in');
        expect(screen.getByTestId('user-name')).toHaveTextContent('testUser');
    });

    it('handles logout correctly', () => {
        mockLocalStorage.getItem.mockReturnValue('testUser');
        
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        act(() => {
            screen.getByTestId('logout-button').click();
        });

        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('userName');
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('userEmail');
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('userRole');
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('userId');
        expect(screen.getByTestId('login-status')).toHaveTextContent('logged-out');
        expect(screen.getByTestId('user-name')).toHaveTextContent('');
    });

    it('throws error when useAuth is used outside AuthProvider', () => {
        const consoleError = console.error;
        console.error = jest.fn();

        expect(() => {
            render(<TestComponent />);
        }).toThrow('useAuth must be used within AuthProvider');
        console.error = consoleError;
    });
}); 