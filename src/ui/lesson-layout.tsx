import type { ReactNode } from "react";
import styles from "./lesson-layout.module.css";

type Props = {
  sidebar: ReactNode;
  children: ReactNode;
};

/** Две колонки: карта темы слева и урок справа; на узком экране — одна. */
export function LessonLayout({ sidebar, children }: Props) {
  return (
    <div className={`container-wide ${styles.layout}`}>
      {sidebar}
      <div>{children}</div>
    </div>
  );
}
