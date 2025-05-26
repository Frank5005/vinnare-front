import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from './Footer';
import React from 'react';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

describe('Footer', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders newsletter section correctly', () => {
        render(
            <MemoryRouter>
                <Footer />
            </MemoryRouter>
        );

        expect(screen.getByText('Sign up for our newsletter')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
        expect(screen.getByText('Sign Up')).toBeInTheDocument();
    });

    it('renders social links correctly', () => {
        render(
            <MemoryRouter>
                <Footer />
            </MemoryRouter>
        );

        expect(screen.getByText('Instagram')).toBeInTheDocument();
        expect(screen.getByText('Facebook')).toBeInTheDocument();
        expect(screen.getByText('WhatsApp')).toBeInTheDocument();
        expect(screen.getByText('@vinnare.ecommerce')).toBeInTheDocument();
    });

    it('renders copyright text correctly', () => {
        render(
            <MemoryRouter>
                <Footer />
            </MemoryRouter>
        );

        expect(screen.getByText('COPYRIGHTS SITE.COM. ALL RIGHTS RESERVED')).toBeInTheDocument();
    });

    it('navigates to signup when newsletter form is submitted', () => {
        render(
            <MemoryRouter>
                <Footer />
            </MemoryRouter>
        );

        const form = screen.getByTestId('newsletter-form');
        fireEvent.submit(form);
        expect(mockNavigate).toHaveBeenCalledWith('/signup');
    });

    it('has correct social media links', () => {
        render(
            <MemoryRouter>
                <Footer />
            </MemoryRouter>
        );

        const instagramLink = screen.getByText('@vinnare.ecommerce').closest('a');
        const facebookLink = screen.getByText('vinnare.ecommerce').closest('a');
        const whatsappLink = screen.getByText('+57 (303) 267-6304').closest('a');

        expect(instagramLink).toHaveAttribute('href', 'https://instagram.com/vinnare.ecommerce');
        expect(facebookLink).toHaveAttribute('href', 'https://facebook.com/vinnare.ecommerce');
        expect(whatsappLink).toHaveAttribute('href', 'https://wa.me/3032676304');
    });
});
