import Link from "next/link";
import { Equation } from "@/ui/equation";

export default function NotFound() {
  return (
    <div className="container">
      <h1>
        <Equation term="404" analogy="адресат выбыл" />
      </h1>
      <p className="lede">Такой страницы нет. Возможно, тему или урок переименовали.</p>
      <p className="lede">
        <Link href="/">К списку тем</Link>
      </p>
    </div>
  );
}
