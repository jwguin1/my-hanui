import PillButton from "@/components/ui/PillButton";
import { MessageCircle, Phone } from "@/components/ui/icons";
import { CLINIC } from "@/lib/clinic";

/** 상담은 카카오톡을 먼저, 전화는 보조 수단으로 안내한다. */
export default function ConsultationActions({
  directions = false,
  className = "",
}: {
  directions?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap ${className}`}>
      <PillButton href={CLINIC.kakaoHref} variant="kakao" icon={<MessageCircle size={16} />} className="w-full sm:w-auto">
        카카오톡 상담
      </PillButton>
      <PillButton href={CLINIC.telHref} variant="outline" icon={<Phone size={16} />} className="w-full sm:w-auto">
        전화 문의 {CLINIC.tel}
      </PillButton>
      {directions && <PillButton href="/contact" variant="outline" className="w-full sm:w-auto">오시는 길·진료시간</PillButton>}
    </div>
  );
}
