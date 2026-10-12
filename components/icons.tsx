type P = { className?: string };
const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };

export const SearchIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
);
export const UserIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>
);
export const BagIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
);
export const MenuIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const CloseIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M6 6l12 12M18 6L6 18" /></svg>
);
export const FlaskIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M7 3h10M9 3v5l-4 9a3 3 0 0 0 3 4h8a3 3 0 0 0 3-4l-4-9V3" /></svg>
);
export const WaveIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M4 12h4l2-5 4 10 2-5h4" /></svg>
);
export const GiftIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><rect x="3" y="8" width="18" height="12" rx="2" /><path d="M12 8v12M3 12h18M12 8c-2-4-6-4-6-1s4 1 6 1c2 0 6 2 6-1s-4-3-6 1" /></svg>
);
export const IdIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="12" r="2.5" /><path d="M14 10h4M14 14h3" /></svg>
);
export const ChevronIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M9 6l6 6-6 6" /></svg>
);

/** Ornament in de gravure-stijl van het etiket: dubbele lijn met ruit. */
export const Ornament = ({ className }: P) => (
  <svg viewBox="0 0 240 16" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1">
    <path d="M0 6h104M0 10h104M136 6h104M136 10h104" />
    <path d="M120 1l7 7-7 7-7-7z" />
    <circle cx="120" cy="8" r="1.6" fill="currentColor" />
  </svg>
);
