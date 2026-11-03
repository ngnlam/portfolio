// Site-wide constants. Change contact details here and they update everywhere.
export const SITE = {
  name: 'Leo Lam Nguyen',
  url: 'https://leolamnguyen.netlify.app',
  role: 'Digital Product Builder',
  location: 'Hanoi, Vietnam',
  email: 'lamnguyen.ptpl@gmail.com',
  linkedin: 'https://www.linkedin.com/in/ngnlam',
  defaultOg: '/og/default.png',
} as const;

export type NavKey = 'work' | 'lab' | 'about';

export const NAV: { label: string; href: string; key: NavKey }[] = [
  { label: 'Work', href: '/work', key: 'work' },
  { label: 'Lab', href: '/lab', key: 'lab' },
  { label: 'About', href: '/about', key: 'about' },
];
