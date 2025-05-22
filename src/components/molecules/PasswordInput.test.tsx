import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import PasswordInput from './PasswordInput';
import React from 'react';

describe('PasswordInput', () => {
  it('renders the label correctly', () => {
    render(<PasswordInput label="Password" />);
    expect(screen.getByText('Password')).toBeInTheDocument();
  });

  it('input is of type password by default', () => {
    render(<PasswordInput label="Password" />);
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('toggles input type when icon is clicked', () => {
    render(<PasswordInput label="Password" />);
    const input = screen.getByLabelText('Password');
    const toggle = screen.getByRole('button', { name: /toggle password visibility/i });
    fireEvent.click(toggle);
    expect(input).toHaveAttribute('type', 'text');
    // Click again to hide password
    fireEvent.click(toggle);
    expect(input).toHaveAttribute('type', 'password');
  });

  it('shows the error message when error prop is provided', () => {
    render(<PasswordInput label="Password" error="Required" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('applies the error class when error prop is provided', () => {
    render(<PasswordInput label="Password" error="Required" />);
    const input = screen.getByLabelText('Password');
    expect(input).toHaveClass('border-red-500');
  });
});