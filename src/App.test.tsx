import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// localStorage is provided by jsdom; clear it between tests
beforeEach(() => {
  localStorage.clear();
});

async function addTodo(text: string) {
  await userEvent.type(screen.getByRole('textbox'), text);
  await userEvent.click(screen.getByRole('button', { name: /^add$/i }));
}

describe('App', () => {
  it('renders the heading and empty state', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /todo/i })).toBeInTheDocument();
    expect(screen.getByText(/nothing here yet/i)).toBeInTheDocument();
  });

  it('shows "0 items left" on initial render', () => {
    render(<App />);
    expect(screen.getByText(/0 items left/i)).toBeInTheDocument();
  });

  it('adds a todo and shows it in the list', async () => {
    render(<App />);
    await addTodo('Buy milk');
    expect(screen.getByText('Buy milk')).toBeInTheDocument();
  });

  it('increments the remaining count when a todo is added', async () => {
    render(<App />);
    await addTodo('Buy milk');
    expect(screen.getByText(/1 item left/i)).toBeInTheDocument();
  });

  it('uses singular "item" for 1 remaining', async () => {
    render(<App />);
    await addTodo('Buy milk');
    expect(screen.getByText('1 item left')).toBeInTheDocument();
  });

  it('uses plural "items" for multiple remaining', async () => {
    render(<App />);
    await addTodo('Task one');
    await addTodo('Task two');
    expect(screen.getByText('2 items left')).toBeInTheDocument();
  });

  it('toggles a todo as completed', async () => {
    render(<App />);
    await addTodo('Buy milk');
    const checkbox = screen.getByRole('checkbox');
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(screen.getByText(/0 items left/i)).toBeInTheDocument();
  });

  it('deletes a todo', async () => {
    render(<App />);
    await addTodo('Buy milk');
    await userEvent.click(
      screen.getByRole('button', { name: /delete "Buy milk"/i }),
    );
    expect(screen.queryByText('Buy milk')).not.toBeInTheDocument();
  });

  it('filters to show only active todos', async () => {
    render(<App />);
    await addTodo('Active task');
    await addTodo('Done task');
    // complete "Done task"
    const checkboxes = screen.getAllByRole('checkbox');
    await userEvent.click(checkboxes[1]);

    await userEvent.click(screen.getByRole('button', { name: /^active$/i }));
    expect(screen.getByText('Active task')).toBeInTheDocument();
    expect(screen.queryByText('Done task')).not.toBeInTheDocument();
  });

  it('filters to show only completed todos', async () => {
    render(<App />);
    await addTodo('Active task');
    await addTodo('Done task');
    const checkboxes = screen.getAllByRole('checkbox');
    await userEvent.click(checkboxes[1]);

    await userEvent.click(screen.getByRole('button', { name: /^completed$/i }));
    expect(screen.queryByText('Active task')).not.toBeInTheDocument();
    expect(screen.getByText('Done task')).toBeInTheDocument();
  });

  it('shows empty state when filter yields no results', async () => {
    render(<App />);
    await addTodo('Active task');
    await userEvent.click(screen.getByRole('button', { name: /^completed$/i }));
    expect(screen.getByText(/nothing here yet/i)).toBeInTheDocument();
  });

  it('does not add a todo when input is empty', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: /^add$/i }));
    expect(screen.getByText(/nothing here yet/i)).toBeInTheDocument();
  });

  it('persists todos in localStorage', async () => {
    render(<App />);
    await addTodo('Persisted task');
    const stored = localStorage.getItem('todos');
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!) as Array<{ text: string }>;
    expect(parsed[0].text).toBe('Persisted task');
  });

  it('loads existing todos from localStorage on mount', () => {
    const todo = {
      id: 'abc',
      text: 'From storage',
      completed: false,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('todos', JSON.stringify([todo]));
    render(<App />);
    expect(screen.getByText('From storage')).toBeInTheDocument();
  });
});
