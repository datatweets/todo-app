import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoFilter } from './TodoFilter';
import type { FilterType } from '../../types/todo';

describe('TodoFilter', () => {
  it('renders all three filter buttons', () => {
    render(<TodoFilter current="all" onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /active/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /completed/i }),
    ).toBeInTheDocument();
  });

  it.each<FilterType>(['all', 'active', 'completed'])(
    'marks the "%s" button as pressed when it is the current filter',
    (filter) => {
      render(<TodoFilter current={filter} onChange={vi.fn()} />);
      const button = screen.getByRole('button', { name: new RegExp(filter, 'i') });
      expect(button).toHaveAttribute('aria-pressed', 'true');
    },
  );

  it('other buttons are not pressed when one filter is active', () => {
    render(<TodoFilter current="active" onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /all/i })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByRole('button', { name: /completed/i })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('calls onChange with "active" when Active is clicked', async () => {
    const onChange = vi.fn();
    render(<TodoFilter current="all" onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: /active/i }));
    expect(onChange).toHaveBeenCalledWith('active');
  });

  it('calls onChange with "completed" when Completed is clicked', async () => {
    const onChange = vi.fn();
    render(<TodoFilter current="all" onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: /completed/i }));
    expect(onChange).toHaveBeenCalledWith('completed');
  });

  it('calls onChange with "all" when All is clicked', async () => {
    const onChange = vi.fn();
    render(<TodoFilter current="active" onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: /all/i }));
    expect(onChange).toHaveBeenCalledWith('all');
  });
});
