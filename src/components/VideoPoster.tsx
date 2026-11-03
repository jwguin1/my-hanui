/** A light preview; the YouTube player is loaded only when requested. */
export default function VideoPoster({ id }: { id: string }) {
  return <>
    <img
      src={`https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`}
      alt=""
      width={480}
      height={360}
      loading="lazy"
      decoding="async"
      className="absolute inset-0 h-full w-full object-cover"
    />
    <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-black/10">
      <span className="flex h-12 w-16 items-center justify-center rounded-xl bg-red-600 text-white shadow-md">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
      </span>
    </span>
  </>;
}
