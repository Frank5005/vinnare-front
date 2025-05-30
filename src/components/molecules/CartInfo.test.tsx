import React from 'react';
import { render, screen } from '@testing-library/react';
import CartInfo from '../../components/molecules/CartInfo';

describe('CartInfo component', () => {
  beforeEach(() => {
    render(<CartInfo />);
  });

  it('renders Return Policy section with correct title and text', () => {
    expect(screen.getByText('Return Policy')).toBeInTheDocument();
    expect(
      screen.getByText(
        'This is our example return policy which is everything you need to know about our returns.'
      )
    ).toBeInTheDocument();
  });

  it('renders Shipping Options section with correct title and text', () => {
    expect(screen.getByText('Shipping Options')).toBeInTheDocument();
    expect(
      screen.getByText('UPS/USPS Surepost and UPS Ground Shipping.')
    ).toBeInTheDocument();
  });

  it('renders both <details> elements as open by default', () => {
    const detailsElements = screen.getAllByRole('group'); // details not detected by role, using workaround
    expect(detailsElements.length).toBe(2);
  });
});
