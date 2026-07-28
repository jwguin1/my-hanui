/**
 * 사이트 네비게이션 단일 소스.
 * 데스크톱 드롭다운 / 모바일 아코디언이 이 배열을 공유한다.
 */
export type NavLink = { href: string; label: string };
export type NavGroup = {
  label: string;
  /** 하위가 없는 단일 링크 그룹 */
  href?: string;
  items?: NavLink[];
};

export const SITE_NAV: NavGroup[] = [
  {
    label: "일산한의원",
    items: [
      { href: "/about", label: "병원 소개" },
      { href: "/doctor", label: "의료진" },
    ],
  },
  {
    label: "진료",
    items: [
      { href: "/pain", label: "통증" },
      { href: "/diet", label: "다이어트" },
      { href: "/skin", label: "피부" },
      { href: "/autonomic", label: "자율신경" },
    ],
  },
  {
    label: "콘텐츠",
    items: [
      { href: "/column", label: "의학칼럼" },
      { href: "/media", label: "유튜브" },
      { href: "/blog", label: "블로그" },
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
  return (group.items ?? []).some((i) => isActivePath(pathname, i.href));
}
