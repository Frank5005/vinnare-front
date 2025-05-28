import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateEmployee from './CreateEmployee';
import { getSecurityQuestions } from "../../services/authService";
import { createEmployee } from "../../services/adminService";
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../../components/organisms/AdminHeader', () => () => <div data-testid="admin-header">Header</div>);

jest.mock('../../layouts/FormCardLayout', () => ({ title, children }: any) => (
    <div data-testid="form-card-layout">
        <div>{title}</div>
        {children}
    </div>
));

jest.mock('../../features/admin/EmployeeForm', () => () => <div data-testid="employee-form">Employee Form</div>);

describe('CreateEmployee', () => {

    const renderCreateEmployee = () => {
        return render(
            <BrowserRouter>
                <CreateEmployee />
            </BrowserRouter>
        );
    };

    it('renders the form and header', () => {
        renderCreateEmployee();
        expect(screen.getByTestId('admin-header')).toBeInTheDocument();
        expect(screen.getByTestId('form-card-layout')).toBeInTheDocument();
        expect(screen.getByText('Employee Portal')).toBeInTheDocument();
        expect(screen.getByText('Create Employee')).toBeInTheDocument();
        expect(screen.getByTestId('employee-form')).toBeInTheDocument();
    });

    it('applies correct styling classes', () => {
        renderCreateEmployee();

        // Check main container classes
        const mainContainer = screen.getByText('Employee Portal').closest('div');
        expect(mainContainer).toHaveClass('min-h-screen', 'flex', 'flex-col', 'bg-gray-100');

        // Check form container classes
        const formContainer = screen.getByText('Create Employee').closest('main');
        expect(formContainer).toHaveClass('flex-1', 'flex', 'flex-col', 'items-center', 'justify-center');
    });

});