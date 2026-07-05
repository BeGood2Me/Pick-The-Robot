export function HomeHeroIllustration({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="24" y="40" width="352" height="200" rx="12" fill="#eff6ff" stroke="#bfdbfe" />
      <rect x="48" y="68" width="120" height="12" rx="4" fill="#1d4ed8" opacity="0.15" />
      <rect x="48" y="92" width="200" height="8" rx="3" fill="#64748b" opacity="0.2" />
      <rect x="48" y="108" width="160" height="8" rx="3" fill="#64748b" opacity="0.15" />
      <rect x="48" y="140" width="140" height="36" rx="8" fill="#fff" stroke="#93c5fd" />
      <rect x="56" y="148" width="60" height="6" rx="2" fill="#1d4ed8" opacity="0.3" />
      <rect x="56" y="160" width="100" height="6" rx="2" fill="#94a3b8" opacity="0.35" />
      <rect x="200" y="140" width="140" height="36" rx="8" fill="#fff" stroke="#93c5fd" />
      <rect x="208" y="148" width="60" height="6" rx="2" fill="#1d4ed8" opacity="0.5" />
      <rect x="208" y="160" width="80" height="6" rx="2" fill="#94a3b8" opacity="0.35" />
      <g transform="translate(280, 56)">
        <rect width="72" height="72" rx="10" fill="#1d4ed8" />
        <circle cx="26" cy="30" r="5" fill="white" />
        <circle cx="46" cy="30" r="5" fill="white" />
        <path d="M22 48h28" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <rect x="32" y="12" width="8" height="6" rx="2" fill="white" opacity="0.9" />
      </g>
      <path
        d="M120 200h160"
        stroke="#1d4ed8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="4 6"
        opacity="0.4"
      />
      <circle cx="200" cy="200" r="6" fill="#1d4ed8" opacity="0.6" />
    </svg>
  );
}
