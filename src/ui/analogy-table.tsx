import type { AnalogyPair } from "@/domain/lesson";
import styles from "./analogy-table.module.css";
import { MAPPING_ID, MAPPING_TITLE } from "./lesson-outline";

export function AnalogyTable({ pairs }: { pairs: AnalogyPair[] }) {
  if (pairs.length === 0) return null;

  return (
    <table id={MAPPING_ID} className={styles.table}>
      <caption className={styles.caption}>{MAPPING_TITLE}</caption>
      <thead>
        <tr>
          <th scope="col">В технологии</th>
          <th scope="col">В жизни</th>
        </tr>
      </thead>
      <tbody>
        {pairs.map((pair) => (
          <tr key={pair.tech}>
            <th scope="row">{pair.tech}</th>
            <td>{pair.real}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
