import type { SVGProps } from "react";

/**
 * 리디자인 컴포넌트에서 쓰는 인라인 아이콘 세트.
 * 외부 아이콘 라이브러리 의존을 늘리지 않기 위해 필요한 것만 직접 그린다.
 * 모두 currentColor 를 따르며 size 로 크기를 지정한다.
 */
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 20, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export function Users(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19" />
      <circle cx="10" cy="8" r="3.2" />
      <path d="M20 19v-1.5a3.5 3.5 0 0 0-2.6-3.4M15.6 5.2a3.2 3.2 0 0 1 0 5.6" />
    </Base>
  );
}

export function HeartMonitor(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="2.8" y="4.5" width="18.4" height="13" rx="2.2" />
      <path d="M8 21h8M12 17.5V21" />
      <path d="M6 11h2.4l1.3-2.6L12 13.4l1.6-2.4H18" />
    </Base>
  );
}

export function Clock(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.4V12l3 1.8" />
    </Base>
  );
}

export function MapPin(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 21c4-4.4 6-7.6 6-10a6 6 0 1 0-12 0c0 2.4 2 5.6 6 10z" />
      <circle cx="12" cy="11" r="2.3" />
    </Base>
  );
}

export function Stethoscope(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6 3v5a4 4 0 0 0 8 0V3" />
      <path d="M4.6 3h2.8M12.6 3h2.8" />
      <path d="M10 16v-4" />
      <path d="M10 16a5 5 0 0 0 9 0v-2" />
      <circle cx="19" cy="12.4" r="1.9" />
    </Base>
  );
}

export function MessageCircle(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M20.4 11.6a8 8 0 0 1-11.6 7.2L4 20l1.2-4.4A8 8 0 1 1 20.4 11.6z" />
    </Base>
  );
}

export function Check(props: IconProps) {
  return (
    <Base strokeWidth={2.4} {...props}>
      <path d="M5 12.6 9.7 17 19 7.6" />
    </Base>
  );
}

export function Phone(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M20.5 16.9v2.6a1.8 1.8 0 0 1-2 1.8 17.6 17.6 0 0 1-7.7-2.8 17.3 17.3 0 0 1-5.3-5.3A17.6 17.6 0 0 1 2.7 5.4a1.8 1.8 0 0 1 1.8-2h2.6a1.8 1.8 0 0 1 1.8 1.6c.1.9.3 1.7.6 2.5a1.8 1.8 0 0 1-.4 1.9L8 10.5a14 14 0 0 0 5.4 5.4l1.1-1.1a1.8 1.8 0 0 1 1.9-.4c.8.3 1.6.5 2.5.6a1.8 1.8 0 0 1 1.6 1.9z" />
    </Base>
  );
}

export function ChartBar(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 20h16" />
      <rect x="5.5" y="11" width="3.4" height="6" rx="1" />
      <rect x="10.8" y="7" width="3.4" height="10" rx="1" />
      <rect x="16.1" y="4" width="3.4" height="13" rx="1" />
    </Base>
  );
}

export function ListCheck(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M10.5 6.5h9M10.5 12h9M10.5 17.5h9" />
      <path d="M4 6.2l1.4 1.4L8 5M4 17.2l1.4 1.4L8 16" />
    </Base>
  );
}

export function Quote(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M9.5 6.5C6.9 7.6 5.5 9.8 5.5 13v4.5h5V12H8c0-1.9.6-3.2 1.5-3.9z" />
      <path d="M18.5 6.5C15.9 7.6 14.5 9.8 14.5 13v4.5h5V12H17c0-1.9.6-3.2 1.5-3.9z" />
    </Base>
  );
}

export function Microscope(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6 20h14" />
      <path d="M9 20a6 6 0 0 0 6-6" />
      <path d="M10.6 4.6l3.4-1.4 2.8 6.6-3.4 1.4z" />
      <path d="M12.4 10.6l1.6 3.6" />
      <path d="M7.5 14.5h4" />
    </Base>
  );
}

export function PlayerPlay(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M8.5 5.6l10 6.4-10 6.4z" />
    </Base>
  );
}

export function HelpCircle(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.8 9.6a2.3 2.3 0 1 1 3.1 2.2c-.6.3-.9.8-.9 1.5v.4" />
      <path d="M12 16.9h.01" />
    </Base>
  );
}

export function Menu(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Base>
  );
}

export function Close(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6 6l12 12M6 18L18 6" />
    </Base>
  );
}
