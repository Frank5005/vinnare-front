import React from 'react';
import { render, screen } from '@testing-library/react';
import SignUpPage from './SignUp';
import { BrowserRouter } from 'react-router-dom';

// Mock the SignUpForm component
jest.mock('../features/auth/components/SignUpForm', () => {
  return function MockSignUpForm() {
    return <div data-testid="mock-signup-form">Sign Up Form</div>;
  };
});

// Mock the image imports using require
const logo = require('../assets/logo.png');
const background = require('../assets/blueLines.png');

describe('SignUpPage', () => {

  const renderSignUpPage = () => {
    return render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );
  };

  it('renders the sign up page with all elements', () => {
    renderSignUpPage();

    // Check for the title
    expect(screen.getByText('Tech Trend Emporium')).toBeInTheDocument();

    // Check for the mocked form
    expect(screen.getByTestId('mock-signup-form')).toBeInTheDocument();

    // Check for the background image
    const backgroundImage = screen.getByAltText('Background pattern');
    expect(backgroundImage).toBeInTheDocument();
    expect(backgroundImage).toHaveAttribute('src', background);

    // Check for the logo
    const logoImage = screen.getByAltText('Tech Trend Emporium');
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute('src', logo);
  });

  it('applies correct styling classes', () => {
    renderSignUpPage();

    // Check main container classes
    const mainContainer = screen.getByTestId('mock-signup-form').closest('.min-h-screen');
    expect(mainContainer).toHaveClass('min-h-screen', 'w-screen', 'flex', 'flex-col', 'md:flex-row', 'bg-gray-100');

    // Check form container classes
    const formContainer = screen.getByText('Tech Trend Emporium').parentElement;
    expect(formContainer).toHaveClass('w-full', 'max-w-sm');

    // Check background container classes
    const backgroundContainer = screen.getByAltText('Background pattern').parentElement;
    expect(backgroundContainer).toHaveClass('hidden', 'md:flex', 'relative', 'w-full', 'md:w-1/2', 'h-screen', 'bg-gray-100', 'overflow-hidden');
  });
}); 