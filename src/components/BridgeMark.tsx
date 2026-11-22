export function BridgeMark({ className = "h-7 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Twin Golden Gate towers */}
      <path d="M18 4V37M46 4V37" stroke="currentColor" strokeWidth="3.2" strokeLinecap="square" />
      {/* Main suspension cables */}
      <path
        d="M3 19C10.5 19 16 12.5 18 6.5C21.5 16.5 26.5 21 32 21C37.5 21 42.5 16.5 46 6.5C48 12.5 53.5 19 61 19"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="butt"
      />
      {/* Vertical suspender cables */}
      <path
        d="M11 17.5V29M25 18.5V29M32 21V29M39 18.5V29M53 17.5V29"
        stroke="currentColor"
        strokeWidth="2.4"
      />
      {/* Horizontal roadway deck */}
      <path d="M3 29H61" stroke="currentColor" strokeWidth="3.2" strokeLinecap="square" />
    </svg>
  );
}
