import { CLINIC } from "@/lib/clinic";

export default function KakaoButton() {
  return (
    <a
      href={CLINIC.kakaoHref}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex h-12 items-center justify-center gap-2 px-4 text-sm font-semibold text-[#3C1E1E] rounded-full bg-[#FEE500] shadow-lg transition-transform duration-200 hover:scale-110 active:scale-95"
      aria-label="카카오톡 상담"
    >
      <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3C6.477 3 2 6.463 2 10.691c0 2.726 1.8 5.117 4.512 6.482-.2.738-.723 2.676-.828 3.09-.13.516.19.51.398.37.164-.109 2.609-1.77 3.668-2.49.73.107 1.482.163 2.25.163 5.523 0 10-3.463 10-7.615C22 6.463 17.523 3 12 3Z"
          fill="#3C1E1E"
        />
      </svg>
      <span>카카오톡 상담</span>
    </a>
  );
}
