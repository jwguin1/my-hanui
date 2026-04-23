"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import DoctorCard from "./DoctorCard";
import SectionReveal from "./SectionReveal";

interface Doctor {
  name: string;
  image: string;
  bio?: string[];
  school?: string;
  credentials?: string[];
  societies?: string[];
}

export default function DoctorGrid({ doctors }: { doctors: Doctor[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const selected = selectedIndex !== null ? doctors[selectedIndex] : null;

  useEffect(() => {
    if (selectedIndex !== null && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedIndex]);

  const handleSelect = (i: number) => {
    setSelectedIndex(selectedIndex === i ? null : i);
  };

  const others = selectedIndex !== null
    ? doctors.filter((_, i) => i !== selectedIndex)
    : doctors;

  return (
    <>
      {/* Selected Doctor Detail */}
      {selected && (
        <section className="section-padding" ref={detailRef}>
          <div className="card overflow-hidden p-0">
            <div className="grid md:grid-cols-[1fr_1.8fr]">
              {/* Photo */}
              <div className="relative aspect-[3/4] md:aspect-auto md:min-h-[500px]">
                <Image
                  src={selected.image}
                  alt={`${selected.name} 원장`}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>

              {/* Bio */}
              <div className="flex flex-col justify-center p-8 md:p-12">
                <p className="text-[0.8rem] text-accent tracking-wide">
                  원장 소개
                </p>
                <h3 className="mt-2 font-serif text-[1.6rem] font-bold text-text">
                  {selected.name}
                </h3>
                <div className="gold-divider mt-5" />
                {selected.bio ? (
                  <div className="mt-6 space-y-4">
                    {selected.bio.map((p, i) => (
                      <p
                        key={i}
                        className="text-[0.92rem] leading-[2] text-text-muted"
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="mt-6 text-[0.92rem] leading-[2] text-text-muted">
                    소개글이 준비 중입니다.
                  </p>
                )}

                {(selected.school ||
                  selected.credentials?.length ||
                  selected.societies?.length) && (
                  <div className="mt-10 border-t border-white/10 pt-8">
                    <p className="text-[0.8rem] text-accent tracking-wide">
                      약력
                    </p>
                    <dl className="mt-4 space-y-5">
                      {selected.school && (
                        <div>
                          <dt className="text-[0.8rem] font-semibold text-text">
                            학력
                          </dt>
                          <dd className="mt-2 text-[0.9rem] leading-[1.8] text-text-muted">
                            {selected.school} 졸업
                          </dd>
                        </div>
                      )}
                      {selected.credentials && selected.credentials.length > 0 && (
                        <div>
                          <dt className="text-[0.8rem] font-semibold text-text">
                            자격
                          </dt>
                          <dd className="mt-2">
                            <ul className="space-y-1.5 text-[0.9rem] leading-[1.7] text-text-muted">
                              {selected.credentials.map((c) => (
                                <li key={c} className="flex gap-2">
                                  <span className="text-accent">·</span>
                                  <span>{c}</span>
                                </li>
                              ))}
                            </ul>
                          </dd>
                        </div>
                      )}
                      {selected.societies && selected.societies.length > 0 && (
                        <div>
                          <dt className="text-[0.8rem] font-semibold text-text">
                            학회 활동
                          </dt>
                          <dd className="mt-2">
                            <ul className="flex flex-wrap gap-x-2 gap-y-1.5 text-[0.85rem] text-text-muted">
                              {selected.societies.map((s, i) => (
                                <li key={s} className="flex items-center gap-2">
                                  <span>{s}</span>
                                  {i < selected.societies!.length - 1 && (
                                    <span className="text-white/20">|</span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                )}

                <button
                  onClick={() => setSelectedIndex(null)}
                  className="btn-ghost mt-8 w-fit text-[0.82rem]"
                >
                  목록으로 돌아가기
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Other Doctors Grid */}
      <section className="section-padding !pt-0">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(selectedIndex !== null ? others : doctors).map((doc) => {
            const originalIndex = doctors.findIndex((d) => d.name === doc.name);
            return (
              <SectionReveal key={doc.name}>
                <DoctorCard
                  name={doc.name}
                  image={doc.image}
                  bio={doc.bio}
                  selected={false}
                  onSelect={() => handleSelect(originalIndex)}
                />
              </SectionReveal>
            );
          })}
        </div>
      </section>
    </>
  );
}
