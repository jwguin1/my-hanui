"use client";

import { useState } from "react";
import VideoPoster from "./VideoPoster";

export default function VideoEmbed({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video bg-surface">
      {playing ? (
        <iframe
          src={`https://www.youtube.com/embed/${encodeURIComponent(id)}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          aria-label={`${title} 영상 재생`}
          onClick={() => setPlaying(true)}
          className="absolute inset-0 h-full w-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-primary"
        >
          <VideoPoster id={id} />
        </button>
      )}
      <noscript><a href={`https://www.youtube.com/watch?v=${encodeURIComponent(id)}`} className="absolute inset-0 z-10 flex items-center justify-center bg-surface text-primary">{title} 영상 보기 →</a></noscript>
    </div>
  );
}
