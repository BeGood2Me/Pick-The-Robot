export function HomeHeroIllustration({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Soft panel */}
      <rect x="20" y="28" width="360" height="224" rx="10" fill="#e0f2fe" fillOpacity="0.55" />
      <rect x="20" y="28" width="360" height="224" rx="10" stroke="#a5f3fc" strokeOpacity="0.7" />

      {/* Grid lines */}
      <g stroke="#0e7490" strokeOpacity="0.12" strokeWidth="1">
        <path d="M48 80h304" />
        <path d="M48 120h304" />
        <path d="M48 160h304" />
        <path d="M48 200h304" />
        <path d="M100 56v168" />
        <path d="M200 56v168" />
        <path d="M300 56v168" />
      </g>

      {/* Scan path */}
      <path
        d="M72 196c40-48 80-48 120 0s80 48 120 0"
        stroke="#0e7490"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="6 8"
        opacity="0.45"
      />
      <circle cx="192" cy="172" r="5" fill="#0e7490" opacity="0.75" className="animate-pulse-soft" />

      {/* Robot unit */}
      <g transform="translate(268, 72)">
        <rect width="84" height="96" rx="8" fill="#0e7490" />
        <rect x="2" y="2" width="80" height="92" rx="7" stroke="white" strokeOpacity="0.18" />
        <rect x="18" y="22" width="48" height="36" rx="6" fill="#0b1220" fillOpacity="0.25" />
        <circle cx="32" cy="40" r="6" fill="white" />
        <circle cx="52" cy="40" r="6" fill="white" />
        <circle cx="32" cy="40" r="2.5" fill="#67e8f9" />
        <circle cx="52" cy="40" r="2.5" fill="#67e8f9" />
        <rect x="28" y="68" width="28" height="6" rx="3" fill="white" opacity="0.85" />
        <rect x="38" y="8" width="8" height="8" rx="2" fill="white" opacity="0.9" />
        <circle cx="42" cy="6" r="3" fill="#67e8f9" opacity="0.9" className="animate-pulse-soft" />
      </g>

      {/* Data cards */}
      <rect x="48" y="72" width="148" height="44" rx="6" fill="white" stroke="#67e8f9" />
      <rect x="60" y="84" width="72" height="6" rx="2" fill="#0e7490" opacity="0.35" />
      <rect x="60" y="98" width="100" height="5" rx="2" fill="#7a8fa8" opacity="0.35" />

      <rect x="48" y="128" width="148" height="44" rx="6" fill="white" stroke="#67e8f9" />
      <rect x="60" y="140" width="88" height="6" rx="2" fill="#0e7490" opacity="0.55" />
      <rect x="60" y="154" width="72" height="5" rx="2" fill="#7a8fa8" opacity="0.35" />

      {/* Status chip */}
      <rect x="48" y="208" width="88" height="22" rx="4" fill="#0e7490" fillOpacity="0.12" />
      <circle cx="62" cy="219" r="3" fill="#0e7490" className="animate-pulse-soft" />
      <rect x="72" y="215" width="48" height="8" rx="2" fill="#0e7490" opacity="0.45" />
    </svg>
  );
}
