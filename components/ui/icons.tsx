export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16.04 3.2c-7.07 0-12.8 5.73-12.8 12.8 0 2.26.6 4.38 1.64 6.22L3.2 28.8l6.78-1.62a12.74 12.74 0 0 0 6.06 1.54h.01c7.07 0 12.8-5.73 12.8-12.8s-5.73-12.72-12.81-12.72Zm0 23.16h-.01a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-4.02.96.96-3.92-.25-.4a10.55 10.55 0 0 1-1.61-5.6c0-5.86 4.78-10.64 10.64-10.64 5.86 0 10.64 4.78 10.64 10.64 0 5.87-4.78 10.67-10.56 10.67Zm5.83-7.97c-.32-.16-1.9-.94-2.2-1.04-.29-.11-.5-.16-.72.16-.21.32-.83 1.04-1.02 1.25-.19.21-.37.24-.69.08-1.87-.93-3.09-1.67-4.32-3.78-.33-.56.33-.52.94-1.73.1-.21.05-.4-.06-.56-.11-.16-.5-1.2-.69-1.65-.18-.43-.37-.37-.5-.38h-.43c-.16 0-.42.06-.64.32-.21.27-.83.81-.83 1.96 0 1.15.86 2.27.98 2.43.13.16 1.77 2.7 4.29 3.68 2.13.84 2.56.68 3.02.63.46-.05 1.49-.61 1.7-1.2.21-.59.21-1.09.15-1.2-.06-.11-.24-.18-.5-.32Z" />
    </svg>
  );
}

export function MenuIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

export function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}

export function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path
        d="M5 4h3.2l1.4 4.2-2 1.6a12 12 0 0 0 6.6 6.6l1.6-2L20 15.8V19a1.5 1.5 0 0 1-1.6 1.5C10.6 20 4 13.4 3.5 5.6A1.5 1.5 0 0 1 5 4Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ClockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronDown({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M5 9l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TruckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M3 7h11v9H3z" strokeLinejoin="round" />
      <path d="M14 11h3.5L21 14.5V16h-7z" strokeLinejoin="round" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17.5" cy="18" r="1.6" />
    </svg>
  );
}

export function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M12 3.5 4.5 6.3v5.2c0 5 3.4 7.7 7.5 9 4.1-1.3 7.5-4 7.5-9V6.3Z" strokeLinejoin="round" />
      <path d="m9 12 2.2 2.2L15.5 10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FlameIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path
        d="M12 3c.5 2.5-3 3.8-3 7.2A3 3 0 0 0 12 13a3 3 0 0 0 3-2.8c1.2.8 2 2.3 2 4a5 5 0 1 1-10 0c0-4.5 4-6 5-11.2Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BoxIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M3.5 7.5 12 3l8.5 4.5V16L12 20.5 3.5 16Z" strokeLinejoin="round" />
      <path d="M3.5 7.5 12 12l8.5-4.5M12 12v8.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
