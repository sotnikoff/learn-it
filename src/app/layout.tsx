import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteFooter } from "@/ui/site-footer";
import { SiteHeader } from "@/ui/site-header";
import { ThemeScript } from "@/ui/theme-script";
import { bodyFont, displayFont } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Проще говоря", template: "%s — Проще говоря" },
  description: "Сложные ИТ-темы простыми словами и на бытовых аналогиях.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // data-theme ставит ThemeScript до гидрации, поэтому расхождение атрибутов ожидаемо.
    <html
      lang="ru"
      className={`${displayFont.variable} ${bodyFont.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        <SiteHeader />
        <main className="container">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
