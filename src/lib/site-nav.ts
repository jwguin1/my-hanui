/**
 * 사이트 네비게이션 단일 소스.
 * 데스크톱 드롭다운 / 모바일 아코디언이 이 배열을 공유한다.
 *
 * 계층은 들여쓰기가 아니라 "그룹 라벨"로 표현한다 —
 * 드롭다운은 평평한 목록이라 항목마다 들여쓰기를 주면 정렬이 어색해진다.
 */
export type NavLink = { href: string; label: string };

/** 라벨이 없으면 구분 없는 단일 묶음 */
export type NavSection = { label?: string; items: NavLink[] };

export type NavGroup = {
  label: string;
  /** 하위가 없는 단일 링크 그룹 */
  href?: string;
  sections?: NavSection[];
};

export const SITE_NAV: NavGroup[] = [
  {
    label: "일산한의원",
    sections: [
      {
        items: [
          { href: "/about", label: "병원 소개" },
          { href: "/doctor", label: "의료진" },
        ],
      },
    ],
  },
  {
    label: "진료",
    sections: [
      {
        label: "통증 · 근골격",
        items: [
          { href: "/pain/acute", label: "급성 통증" },
          { href: "/pain/chronic", label: "만성 통증" },
          { href: "/accident", label: "교통사고" },
          { href: "/pain", label: "통증 의학정보" },
        ],
      },
      {
        label: "내과 · 미용",
        items: [
          { href: "/diet/program", label: "다이어트 처방" },
          { href: "/diet", label: "다이어트 의학정보" },
          { href: "/skin/spot", label: "잡티 제거" },
          { href: "/skin", label: "피부 의학정보" },
          { href: "/autonomic/care", label: "이명·어지럼·두통" },
          { href: "/autonomic", label: "자율신경 의학정보" },
        ],
      },
    ],
  },
  {
    label: "콘텐츠",
    sections: [
      {
        items: [
          { href: "/column", label: "의학칼럼" },
          { href: "/media", label: "유튜브" },
          { href: "/blog", label: "블로그" },
        ],
      },
    ],
  },
  { label: "오시는 길", href: "/contact" },
];

/** 현재 경로가 해당 링크(또는 그 하위)인지 */
export function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** 그룹 안에 활성 링크가 있는지 */
export function isActiveGroup(pathname: string, group: NavGroup) {
  if (group.href) return isActivePath(pathname, group.href);
  return (group.sections ?? []).some((s) =>
    s.items.some((i) => isActivePath(pathname, i.href))
  );
}
