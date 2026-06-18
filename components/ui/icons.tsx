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
