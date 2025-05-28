it('calls handleAccept when Accept is clicked', () => {
    const handleAccept = jest.fn();
    mockedUseJobsList.mockReturnValueOnce({
      ...mockedUseJobsList(),
      handleAccept
    });
    render(<JobsList />);
    const acceptButton = screen.getAllByRole('button', { name: /accept/i })[0];
    fireEvent.click(acceptButton);
    expect(handleAccept).toHaveBeenCalled();
  });

  it('calls handleReject when Decline is clicked', () => {
    const handleReject = jest.fn();
    mockedUseJobsList.mockReturnValueOnce({
      ...mockedUseJobsList(),
      handleReject
    });
    render(<JobsList />);
    const declineButton = screen.getAllByRole('button', { name: /decline/i })[0];
    fireEvent.click(declineButton);
    expect(handleReject).toHaveBeenCalled();
  });

  it('filters jobs by date', () => {
        render(<JobsList />);
        const select = screen.getByTestId('order-date-filter');
        fireEvent.change(select, { target: { value: 'all' } });
        expect(select).toHaveValue('all');
    });