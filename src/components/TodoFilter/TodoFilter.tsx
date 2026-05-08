import type { FilterType } from '../../types/todo';
import styles from './TodoFilter.module.css';

interface TodoFilterProps {
  current: FilterType;
  onChange: (filter: FilterType) => void;
}

const FILTERS: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
];

export function TodoFilter({ current, onChange }: TodoFilterProps) {
  return (
    <div className={styles.filterBar} role="group" aria-label="Filter todos">
      {FILTERS.map(({ label, value }) => (
        <button
          key={value}
          className={current === value ? styles.btnActive : styles.btn}
          onClick={() => onChange(value)}
          aria-pressed={current === value}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
