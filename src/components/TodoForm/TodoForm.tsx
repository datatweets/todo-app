import { useState, type FormEvent } from 'react';
import styles from './TodoForm.module.css';

interface TodoFormProps {
  onAdd: (text: string) => void;
}

export function TodoForm({ onAdd }: TodoFormProps) {
  const [value, setValue] = useState('');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onAdd(value);
    setValue('');
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        placeholder="What needs to be done?"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="New todo text"
      />
      <button className={styles.addBtn} type="submit" disabled={!value.trim()}>
        Add
      </button>
    </form>
  );
}
