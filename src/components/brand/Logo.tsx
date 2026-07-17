export function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect width="28" height="28" rx="5" fill="var(--color-accent, #0e7490)" />
      <rect x="1.5" y="1.5" width="25" height="25" rx="4" stroke="white" strokeOpacity="0.2" />
      <circle cx="10" cy="11" r="2.25" fill="white" />
      <circle cx="18" cy="11" r="2.25" fill="white" />
      <path d="M9.5 17.5h9" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <rect x="12.5" y="4" width="3" height="4" rx="1" fill="white" opacity="0.95" />
      <circle cx="14" cy="3.5" r="1.25" fill="white" opacity="0.7" className="animate-pulse-soft" />
    </svg>
  );
}
