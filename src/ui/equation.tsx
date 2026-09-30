import styles from "./equation.module.css";

type Props = {
  term: string;
  analogy: string;
  size?: "hero" | "row";
};

/** Формула «термин = аналогия». Оборачивается в заголовок или ссылку снаружи. */
export function Equation({ term, analogy, size = "hero" }: Props) {
  return (
    <span className={`${styles.equation} ${styles[size]}`}>
      <span className={styles.term}>{term}</span>
      <span className={styles.analogy}>
        <span className={styles.sign} aria-hidden="true">
          =
        </span>
        <span>
          <span className="visually-hidden"> — это </span>
          {analogy}
        </span>
      </span>
    </span>
  );
}
