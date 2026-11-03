// Company logos in their original colors (brand rule: never recolor).
// Heights mirror the published canvas for each context.
import vinfast from '../assets/images/logos/vinfast.png';
import vindynamics from '../assets/images/logos/vindynamics.png';
import xanhsm from '../assets/images/logos/xanhsm.png';
import fpts from '../assets/images/logos/fpt-securities.png';
import hongha from '../assets/images/logos/hong-ha.png';
import upwork from '../assets/images/logos/upwork.png';

export const LOGOS = {
  vinfast: { name: 'VinFast', src: vinfast },
  vindynamics: { name: 'VinDynamics', src: vindynamics },
  xanhsm: { name: 'Xanh SM', src: xanhsm },
  fpts: { name: 'FPT Securities', src: fpts },
  hongha: { name: 'Hong Ha', src: hongha },
  upwork: { name: 'Upwork', src: upwork },
} as const;

export type LogoKey = keyof typeof LOGOS;

/** Order and per-context heights (px) for the "Where I've worked" rows. */
export const WORKED_AT: { key: LogoKey; h: { band: number; bandMobile: number; about: number; aboutMobile: number } }[] = [
  { key: 'vinfast', h: { band: 50, bandMobile: 38, about: 40, aboutMobile: 32 } },
  { key: 'vindynamics', h: { band: 54, bandMobile: 40, about: 44, aboutMobile: 35 } },
  { key: 'xanhsm', h: { band: 36, bandMobile: 26, about: 30, aboutMobile: 24 } },
  { key: 'fpts', h: { band: 36, bandMobile: 26, about: 28, aboutMobile: 22 } },
  { key: 'hongha', h: { band: 52, bandMobile: 40, about: 40, aboutMobile: 32 } },
  { key: 'upwork', h: { band: 46, bandMobile: 36, about: 36, aboutMobile: 29 } },
];
