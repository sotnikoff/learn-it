import type { Comparison } from "@/domain/lesson";
import styles from "./comparison-table.module.css";
import { COMPARISON_ID, COMPARISON_TITLE } from "./lesson-outline";

export function ComparisonTable({ comparison }: { comparison: Comparison }) {
  return (
    <div id={COMPARISON_ID} className={styles.scroller}>
      <table className={styles.table}>
        <caption className={styles.caption}>{COMPARISON_TITLE}</caption>
        <thead>
          <tr>
            <th scope="col">
              <span className="visually-hidden">Что сравниваем</span>
            </th>
            {comparison.columns.map((column) => (
              <th key={column} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparison.rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              {row.cells.map((cell, i) => (
                <td key={i}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
