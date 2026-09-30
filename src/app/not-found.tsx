import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <h1>Такой страницы нет</h1>
      <p>Возможно, тему или урок переименовали.</p>
      <p>
        <Link href="/">К списку тем</Link>
      </p>
    </>
  );
}
