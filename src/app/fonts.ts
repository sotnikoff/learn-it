import { Geologica, Literata } from "next/font/google";

/** Заголовки и формула «термин = аналогия». */
export const displayFont = Geologica({
  subsets: ["latin", "cyrillic"],
  variable: "--font-geologica",
  display: "swap",
});

/** Основной текст. */
export const bodyFont = Literata({
  subsets: ["latin", "cyrillic"],
  variable: "--font-literata",
  display: "swap",
});
