import { listTopics } from "@/composition/container";
import { Equation } from "@/ui/equation";
import { TopicList } from "@/ui/topic-list";

export default async function HomePage() {
  const topics = await listTopics();

  return (
    <>
      <h1>
        <Equation term="Сложное" analogy="знакомое" />
      </h1>
      <p className="lede">
        Берём сложную ИТ-тему и объясняем её на том, что все и так знают: почта, очередь в
        окошко, журнал выдачи. Без заумных слов — а где без них никак, сразу переводим.
      </p>
      <h2 className="section-title">Темы</h2>
      <TopicList topics={topics} />
    </>
  );
}
