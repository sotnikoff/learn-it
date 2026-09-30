export const THEME_STORAGE_KEY = "theme";

/** «auto» — следовать за ОС; в хранилище и в data-theme при этом ничего нет. */
export type ThemeChoice = "auto" | "light" | "dark";

export const THEME_CHOICES: { value: ThemeChoice; label: string }[] = [
  { value: "auto", label: "Авто" },
  { value: "light", label: "День" },
  { value: "dark", label: "Ночь" },
];
