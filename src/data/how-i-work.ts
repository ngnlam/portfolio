// Home section "How I take a feature from problem to launch".
// One step per stage, each backed by a case. Numbers must already exist in that case.
export interface HowStep {
  stage: 'Discover' | 'Define' | 'Ship' | 'Measure';
  title: string;
  text: string;
  slug: string;
  linkLabel: string;
}

export const HOW_I_WORK: HowStep[] = [
  {
    stage: 'Discover',
    title: 'Find where users get stuck',
    text: 'At Xanh SM I traced where food orders stalled across 211,272 add-to-cart events before planning any fix.',
    slug: 'xanh-sm-rider-journeys',
    linkLabel: 'The Xanh SM case',
  },
  {
    stage: 'Define',
    title: 'Write it for the build team',
    text: "For Dyno I led requirements for two of five use cases: site research, BRDs and user stories, then cut 18 parking stories to the 6 that would change the build.",
    slug: 'dyno-requirements',
    linkLabel: 'The Dyno case',
  },
  {
    stage: 'Ship',
    title: 'Get it built and live',
    text: "After a redesign cut leads, I specified new entry points for VinFast's car pages and the web team built them. In the first month, 81% of car-page leads started at them, a share rather than a lift.",
    slug: 'car-product-pages',
    linkLabel: 'The car pages case',
  },
  {
    stage: 'Measure',
    title: 'Measure, then fix',
    text: 'One event plan for every VinFast product page, and a regression test for the AI sales agent.',
    slug: 'o2o-measurement',
    linkLabel: 'The measurement case',
  },
];
