import { useTodos } from './hooks/useTodos';
import { TodoForm } from './components/TodoForm/TodoForm';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { TodoItem } from './components/TodoItem/TodoItem';
import styles from './App.module.css';

function App() {
  const {
    filter,
    filteredTodos,
    remainingCount,
    addTodo,
    toggleTodo,
    deleteTodo,
    setFilter,
  } = useTodos();

  return (
    <div className={styles.page}>
      <main className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>Todo</h1>
          <span className={styles.count}>
            {remainingCount} item{remainingCount !== 1 ? 's' : ''} left
          </span>
        </header>

        <TodoForm onAdd={addTodo} />
        <TodoFilter current={filter} onChange={setFilter} />

        {filteredTodos.length === 0 ? (
          <p className={styles.empty}>Nothing here yet.</p>
        ) : (
          <ul className={styles.list}>
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

export default App;
