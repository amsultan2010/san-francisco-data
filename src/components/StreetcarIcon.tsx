export function StreetcarIcon({ className = "h-4 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M14 1.5L11 4.5H17L14 1.5Z" stroke="currentColor" strokeWidth="1.25" />
      <rect x="3.5" y="4.5" width="21" height="9" rx="1.25" stroke="currentColor" strokeWidth="1.25" />
      <path d="M7.5 7.5H10.5M12.5 7.5H15.5M17.5 7.5H20.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M2 16H26" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <circle cx="8.5" cy="14.5" r="1.25" fill="currentColor" />
      <circle cx="19.5" cy="14.5" r="1.25" fill="currentColor" />
    </svg>
  );
}
