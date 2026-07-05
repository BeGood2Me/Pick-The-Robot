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

      <rect width="28" height="28" rx="6" fill="var(--color-accent, #1d4ed8)" />

      <circle cx="10" cy="11" r="2" fill="white" />

      <circle cx="18" cy="11" r="2" fill="white" />

      <path

        d="M9 17h10"

        stroke="white"

        strokeWidth="2"

        strokeLinecap="round"

      />

      <rect x="12" y="4" width="4" height="3" rx="1" fill="white" opacity="0.9" />

    </svg>

  );

}


