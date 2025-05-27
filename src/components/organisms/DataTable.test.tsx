import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { DataTable, DataTableColumn, DataTableAction } from './DataTable';

type Row = { id: number; name: string; value: number };

const columns: DataTableColumn<Row>[] = [
  { key: 'name', label: 'Name' },
  { key: 'value', label: 'Value' },
];

const data: Row[] = [
  { id: 1, name: 'Row 1', value: 10 },
  { id: 2, name: 'Row 2', value: 20 },
];

describe('DataTable', () => {
  it('shows loading message', () => {
    render(<DataTable columns={columns} data={[]} loading />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<DataTable columns={columns} data={[]} error="Error!" />);
    expect(screen.getByText(/error!/i)).toBeInTheDocument();
  });

  it('renders rows and columns', () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText('Row 1')).toBeInTheDocument();
    expect(screen.getByText('Row 2')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
  });

  it('renders actions and calls onClick', () => {
    const onClick = jest.fn();
    const actions: DataTableAction<Row>[] = [
      { icon: <span>Act</span>, label: 'Action', onClick },
    ];
    render(<DataTable columns={columns} data={data} actions={actions} />);
    const buttons = screen.getAllByTitle('Action');
    expect(buttons).toHaveLength(2);
    fireEvent.click(buttons[0]);
    expect(onClick).toHaveBeenCalledWith(data[0]);
  });

  it('calls onRowClick when a row is clicked', () => {
    const onRowClick = jest.fn();
    render(<DataTable columns={columns} data={data} onRowClick={onRowClick} />);
    const row = screen.getByText('Row 1').closest('tr');
    if (row) fireEvent.click(row);
    expect(onRowClick).toHaveBeenCalledWith(data[0]);
  });
});