import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import InputField from './InputField';


describe('InputField', () => {
  it('renders the label correctly', () => {
    render(<InputField label="Username" />);
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('renders the input with the correct props', () => {
    render(<InputField label="Email" placeholder="Enter your email" />);
    const input = screen.getByPlaceholderText('Enter your email');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text'); 
  });

  it('shows the error message when error prop is provided', () => {
    render(<InputField label="Password" error="Required" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('applies the error class when error prop is provided', () => {
    render(<InputField label="Password" error="Required" />);
    const input = screen.getByLabelText('Password');
    expect(input).toHaveClass('border-red-500');
  });
}); 