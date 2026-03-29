"use client";

import Image from "next/image";

interface DoctorCardProps {
  name: string;
  image: string;
  bio?: string[];
  onSelect?: () => void;
  selected?: boolean;
}

export default function DoctorCard({ name, image, onSelect, selected }: DoctorCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`card w-full cursor-pointer overflow-hidden text-left transition-all duration-200 hover:-translate-y-1 ${
        selected ? "border-accent" : ""
      }`}
    >
      <div className="relative aspect-[3/4]">
        <Image
          src={image}
          alt={`${name} 원장`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <p className="text-[0.75rem] text-accent">원장</p>
        <h3 className="mt-1 font-serif text-[1.2rem] font-semibold text-text">
          {name}
        </h3>
      </div>
    </button>
  );
}
