import FaqList from "./ui/FaqList";
export default function PatientQuestions({ items }: { items: { quote: string; answer: string }[] }) {
  return <div className="mx-auto mt-8 max-w-4xl"><FaqList items={items.map(item => ({ q: item.quote, a: item.answer }))} /></div>;
}
