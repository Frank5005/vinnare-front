import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import LoginPage from './Login';
import React from 'react';


jest.mock('../features/auth/components/LoginForm', () => () => <div data-testid="login-form">LoginForm</div>);

describe('LoginPage', () => {
  it('renders the main title', () => {
    render(<LoginPage />);
    expect(screen.getByText(/tech trend emporium/i)).toBeInTheDocument();
  });

  it('renders the LoginForm component', () => {
    render(<LoginPage />);
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  it('renders the logo image', () => {
    render(<LoginPage />);
    expect(screen.getByAltText(/tech trend emporium/i)).toBeInTheDocument();
  });

  it('renders the background image', () => {
    render(<LoginPage />);
    expect(screen.getByAltText(/background pattern/i)).toBeInTheDocument();
  });
});