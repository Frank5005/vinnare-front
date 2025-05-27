import React from 'react';
import { render, screen } from '@testing-library/react';
import ForgotPasswordPage from './ForgotPassword';
import { BrowserRouter } from 'react-router-dom';

//Mock the ForgotPasswordForm component
jest.mock('../features/auth/components/ForgotPasswordForm', () => {
    return function MockForgotPasswordForm() {
        return <div data-testid="mock-forgotpassword-form">Forgot Password Form</div>;
    };
});

// Mock the image imports using require
const logo = require('../assets/logo.png');
const background = require('../assets/blueLines.png');

describe('ForgotPasswordPage', () => {
    const renderForgotPasswordPage = () => {
        return render(
            <BrowserRouter>
                <ForgotPasswordPage />
            </BrowserRouter>
        );
    };

    it('renders the forgot password page with all elements', () => {
        renderForgotPasswordPage();

        // Check for the title
        expect(screen.getByText('Tech Trend Emporium')).toBeInTheDocument();

        // Check for the mocked form
        expect(screen.getByTestId('mock-forgotpassword-form')).toBeInTheDocument();

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
        renderForgotPasswordPage();

        // Check main container classes
        const mainContainer = screen.getByTestId('forgot-password-page');
        expect(mainContainer).toHaveClass('w-screen', 'h-screen', 'flex', 'flex-col', 'md:flex-row');

        // Check form container classes
        const formContainer = screen.getByText('Tech Trend Emporium').parentElement;
        expect(formContainer).toHaveClass('w-full', 'max-w-sm');

        // Check background container classes
        const backgroundContainer = screen.getByAltText('Background pattern').parentElement;
        expect(backgroundContainer).toHaveClass('hidden', 'md:flex', 'relative', 'w-full', 'md:w-1/2', 'h-screen', 'bg-gray-100', 'overflow-hidden');
    });
});