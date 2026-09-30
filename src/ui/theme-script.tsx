import { THEME_STORAGE_KEY } from "./theme";

// Выполняется до первой отрисовки, чтобы сохранённая тема не мигала при загрузке.
const script = `try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
