"use client";

import { useSyncExternalStore } from "react";
import { THEME_CHOICES, THEME_STORAGE_KEY, type ThemeChoice } from "./theme";
import styles from "./theme-switch.module.css";

const CHANGE_EVENT = "themechange";

function toChoice(value: string | null | undefined): ThemeChoice {
  return value === "light" || value === "dark" ? value : "auto";
}

function setRootTheme(choice: ThemeChoice) {
  const root = document.documentElement;
  if (choice === "auto") delete root.dataset.theme;
  else root.dataset.theme = choice;
}

function choose(choice: ThemeChoice) {
  setRootTheme(choice);
  try {
    if (choice === "auto") localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, choice);
  } catch {
    // Хранилище недоступно — тема применится, но не запомнится.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  // Тему сменили в другой вкладке.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY) return;
    setRootTheme(toChoice(event.newValue));
    onChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

const getSnapshot = () => toChoice(document.documentElement.dataset.theme);
const getServerSnapshot = (): ThemeChoice => "auto";

export function ThemeSwitch() {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <fieldset className={styles.switch}>
      <legend className="visually-hidden">Тема оформления</legend>
      {THEME_CHOICES.map(({ value, label }) => (
        <label key={value} className={styles.option}>
          <input
            className="visually-hidden"
            type="radio"
            name="theme"
            value={value}
            checked={current === value}
            onChange={() => choose(value)}
          />
          <span className={styles.label}>{label}</span>
        </label>
      ))}
    </fieldset>
  );
}
