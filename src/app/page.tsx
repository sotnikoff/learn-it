import { listCategories } from "@/composition/container";
import { Catalog } from "@/ui/catalog";
import { Equation } from "@/ui/equation";

export default async function HomePage() {
  const categories = await listCategories();

  return (
    <div className="container">
      <h1>
        <Equation term="Сложное" analogy="знакомое" />
      </h1>
      <p className="lede">
        Берём сложную ИТ-тему и объясняем её на том, что все и так знают: почта, очередь в
        окошко, журнал выдачи. Без заумных слов — а где без них никак, сразу переводим.
      </p>
      <h2 className="section-title">Разделы</h2>
      <Catalog categories={categories} />
    </div>
  );
}
