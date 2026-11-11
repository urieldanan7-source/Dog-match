import type { SVGProps } from 'react'

const S = ({ children, ...p }: SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...p}>{children}</svg>
)
type P = SVGProps<SVGSVGElement>
/** In RTL "forward" points left. */
export const Forward = (p: P) => <S {...p}><path d="M15 5l-7 7 7 7" /></S>
export const Back = (p: P) => <S {...p}><path d="M9 5l7 7-7 7" /></S>
export const Menu = (p: P) => <S {...p}><path d="M4 7h16M4 12h16M4 17h16" /></S>
export const Close = (p: P) => <S {...p}><path d="M6 6l12 12M18 6L6 18" /></S>
export const Check = (p: P) => <S {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></S>
export const Alert = (p: P) => <S {...p}><path d="M12 4l9 16H3z" /><path d="M12 10v4M12 17.2v.1" /></S>
export const Phone = (p: P) => <S {...p}><path d="M6 3h3l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v3a3 3 0 0 1-3 3A15 15 0 0 1 3 6a3 3 0 0 1 3-3z" /></S>
export const Share = (p: P) => <S {...p}><path d="M12 15V4M8 8l4-4 4 4M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" /></S>
export const Moon = (p: P) => <S {...p}><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" /></S>
export const Sun = (p: P) => <S {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" /></S>
export const Paw = (p: P) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...p}>
    <ellipse cx="6" cy="10" rx="2" ry="2.6" /><ellipse cx="10" cy="6" rx="2" ry="2.7" /><ellipse cx="14.5" cy="6" rx="2" ry="2.7" /><ellipse cx="18.5" cy="10" rx="2" ry="2.6" />
    <path d="M12.2 11c-3 0-5.7 3.2-5.7 5.6 0 1.800 1.500 2.600 3 2.600 1 0 1.800-.5 2.700-.5s1.700.5 2.700.5c1.500 0 3-.8 3-2.600 0-2.400-2.700-5.600-5.700-5.600z" />
  </svg>
)
