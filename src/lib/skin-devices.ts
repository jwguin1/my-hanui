/** Supplied clinic equipment photos, in the clinic's display order. */
export const SKIN_DEVICES = [
  { id: "upulse", name: "유펄스", type: "CO₂ 레이저", description: "점·편평사마귀·쥐젖 제거", href: "/skin/spot" },
  { id: "element-tl", name: "엘리멘트 TL", type: "롱펄스 레이저", description: "색소·홍조·재생치료, 제네시스 토닝과 제모", href: "/skin/pigmentation" },
  { id: "volnewmer", name: "볼뉴머", type: "고주파 RF", description: "피부 탄력 리프팅", href: "/skin/lifting" },
  { id: "picohi", name: "피코하이", type: "피코 레이저", description: "색소치료와 피코토닝", href: "/skin/toning" },
  { id: "shurink-universe", name: "슈링크 유니버스", type: "집속초음파 HIFU", description: "얼굴선 리프팅", href: "/skin/lifting" },
  { id: "agnes", name: "아그네스", type: "미세침 고주파 RF", description: "피지선에 집중하는 여드름 치료", href: "/skin/agnes" },
] as const;
export type SkinDeviceId = (typeof SKIN_DEVICES)[number]["id"];
export const TREATMENT_DEVICES: Record<string, readonly SkinDeviceId[]> = {
  spot: ["upulse"], pigmentation: ["element-tl", "picohi"], toning: ["element-tl", "picohi"],
  lifting: ["volnewmer", "shurink-universe"], "hair-removal": ["element-tl"], agnes: ["agnes"],
};
