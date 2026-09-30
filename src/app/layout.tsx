import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { default: "Проще говоря", template: "%s — Проще говоря" },
  description: "Сложные ИТ-темы простыми словами и на бытовых аналогиях.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <header>
          <nav aria-label="Основная навигация">
            <Link href="/">Проще говоря</Link>
          </nav>
        </header>
        <hr />
        <main>{children}</main>
        <hr />
        <footer>
          <p>Сложные ИТ-темы — человеческим языком.</p>
        </footer>
      </body>
    </html>
  );
}
