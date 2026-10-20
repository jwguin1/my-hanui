export default function Loading(){
  return <div role="status" aria-live="polite" className="min-h-[60vh] bg-[#f7f6f0] px-6 py-16">
    <div className="mx-auto max-w-3xl">
      <p className="text-sm text-[#376456]">복약편지를 불러오고 있습니다.</p>
      <div aria-hidden="true" className="mt-6 space-y-5 motion-safe:animate-pulse">
        <div className="h-8 w-2/3 rounded bg-[#e5e8df]"/>
        <div className="h-64 rounded-xl bg-[#e5e8df]"/>
        <div className="h-4 rounded bg-[#e5e8df]"/>
        <div className="h-4 w-4/5 rounded bg-[#e5e8df]"/>
      </div>
    </div>
  </div>;
}
