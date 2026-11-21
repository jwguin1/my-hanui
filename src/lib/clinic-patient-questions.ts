import data from "./clinic-patient-questions.json";

export type PatientQuestion = {
  id: string;
  q: string;
  a?: string;
  href?: string;
  label?: string;
};

type QuestionGroup = { title: string; items: PatientQuestion[] };
const byPath: Readonly<Record<string, QuestionGroup[]>> = data;

export function clinicQuestionGroups(path: string): QuestionGroup[] {
  return byPath[path] ?? [];
}

export function clinicFaqItems(path: string) {
  return clinicQuestionGroups(path).flatMap(group =>
    group.items.flatMap(({ q, a }) => a ? [{ q, a }] : []),
  );
}

const directoryGroups: Readonly<Record<string, string>> = {
  "/skin/spot": "미용",
  "/skin/pigmentation": "미용",
  "/aftercare": "미용",
  "/internal/dyspepsia": "기능성 소화불량",
  "/herbal/insurance/period-pain": "월경·산후",
  "/herbal/insurance/rhinitis": "비염",
  "/blog/일산-산후보약-유산후보약": "월경·산후",
  "/diet/program": "다이어트",
  "/pain/acute": "통증",
  "/accident": "통증",
  "/blog/일산-재활-도수치료-운동": "통증",
  "/pain/chronic": "통증",
  "/herbal/insurance/lumbar-disc": "통증",
  "/treatment": "원내 검사·치료",
};

export function clinicDirectoryEntries() {
  return Object.entries(byPath).flatMap(([path, groups]) =>
    groups.flatMap(group => group.items.flatMap(({ id, q, a, label }) => {
      if (!a) return [];
      const sentences = a.split(/(?<=[.!?])\s+/);
      const description = sentences.slice(0, sentences[0].length < 15 ? 2 : 1).join(" ");
      return [{
        title: q, description, href: `${path}#faq-${id}`,
        group: directoryGroups[path], keywords: `${group.title} ${label ?? ""}`,
      }];
    })),
  );
}
