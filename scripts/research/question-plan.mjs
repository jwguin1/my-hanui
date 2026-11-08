import { categories } from './config.mjs';

// Prefer unanswered patient questions. Citation scores rank papers only within a question.
export function questionPlan(category, articles) {
  const c = categories[category];
  if (!c) throw Error('Unknown research category');
  return c.topics.map((query, index) => {
    const id = `${category}-${index + 1}`;
    const used = articles.filter(a => a.status === 'published' && a.editorialQuestion?.id === id);
    return { id, index, query, question: c.questions?.[index] || c.label, count: used.length,
      last: used.map(a => a.publishedAt).sort().at(-1) || '' };
  }).sort((a, b) => a.count - b.count || a.last.localeCompare(b.last) || a.index - b.index);
}
