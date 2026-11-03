// Energy audit: list what fills your week, score each item, see a 2 x 2 map and three suggestions.
// Everything stays in the browser (localStorage, wrapped in try/catch). Only anonymous Umami events
// leave the page: lab_start, lab_complete, lab_save, with a mode and an item count, never the text.
// Copy: docs/content.md 6.2 and 6.3. Scoring and placement rules ported from the design canvas.

type Imp = 'hi' | 'lo';
type Step = 0 | 1 | 2 | 3;
type Quad = 'Protect' | 'Redesign' | 'Enjoy, within limits' | 'Drop';

interface Item {
  id: number;
  name: string;
  energy: number | null;
  imp: Imp | null;
}

interface State {
  step: Step;
  items: Item[];
  nextId: number;
  example: boolean;
  draft: string;
  error: string;
  scoreMsg: string;
  toast: string;
  toastKind: 'ok' | 'err';
  confirm: boolean;
  resume: { step: Step; items: Item[]; nextId: number } | null;
}

const KEY = 'energy-audit:v1';
const MAX_ITEMS = 15;
const MIN_ITEMS = 3;
const NUDGE_BELOW = 5;
const MAX_LEN = 60;

const EXAMPLE: [string, number, Imp][] = [
  ['Two-hour focus block', 2, 'hi'],
  ['Monday team meeting', -1, 'hi'],
  ['Weekly report by hand', -2, 'hi'],
  ['1:1 with my manager', 1, 'hi'],
  ['Evening course', 1, 'hi'],
  ['Email triage', -2, 'lo'],
  ['Scrolling at lunch', -1, 'lo'],
  ['Cooking dinner', 1, 'lo'],
  ['Gym', 2, 'lo'],
  ['Commute', -1, 'lo'],
];

const ENERGY_NAMES: Record<string, string> = {
  '-2': 'Drained',
  '-1': 'A bit drained',
  '0': 'Neutral',
  '1': 'A bit energized',
  '2': 'Energized',
};

const QUAD_COLOR: Record<Quad, string> = {
  Protect: '#FFC93C',
  Redesign: '#8A5A3B',
  Drop: '#D9DCE1',
  'Enjoy, within limits': '#FFFFFF',
};

const ICON = {
  plus: 'M12 4v16M4 12h16',
  pen: 'M4 20l4-1 11-11-3-3L5 16zM14 6l3 3',
  minus: 'M5 12h14',
  close: 'M6 6l12 12M18 6L6 18',
  warn: 'M12 3l9.5 17h-19z M12 10v4.5 M12 17.2v.3',
  check: 'M5 12.5l4.5 4.5L19 7.5',
};

const FONT_DISPLAY = '"Bricolage Grotesque Variable", "Bricolage Grotesque", system-ui, sans-serif';
const FONT_BODY = '"Inter Variable", "Inter", system-ui, sans-serif';
const FONT_MONO = '"JetBrains Mono Variable", "JetBrains Mono", ui-monospace, monospace';

/* ---------------- helpers ---------------- */

type Child = Node | string | null | undefined | false;
type Props = Record<string, unknown>;

function h(tag: string, props: Props = {}, ...children: Child[]): HTMLElement {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === 'class') el.className = String(v);
    else if (k === 'text') el.textContent = String(v);
    else if (k.startsWith('on') && typeof v === 'function') {
      el.addEventListener(k.slice(2).toLowerCase(), v as EventListener);
    } else if (k === 'style' && typeof v === 'object') {
      Object.assign(el.style, v as Record<string, string>);
    } else if (v === true) el.setAttribute(k, '');
    else el.setAttribute(k, String(v));
  }
  for (const c of children) {
    if (c === null || c === undefined || c === false) continue;
    el.append(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return el;
}

function svgIcon(d: string, size = 20, cls = ''): SVGSVGElement {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.5');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  if (cls) svg.setAttribute('class', cls);
  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', d);
  svg.append(path);
  return svg;
}

function energyLabel(v: number): string {
  if (v > 0) return '+' + v;
  if (v < 0) return '−' + Math.abs(v);
  return '0';
}

function quadOf(it: Item): Quad {
  if (it.imp === 'hi') return (it.energy ?? 0) > 0 ? 'Protect' : 'Redesign';
  return (it.energy ?? 0) > 0 ? 'Enjoy, within limits' : 'Drop';
}

function isScored(it: Item): boolean {
  return it.energy !== null && it.imp !== null;
}

function track(name: string, data?: Record<string, string | number>): void {
  try {
    const u = (window as unknown as { umami?: { track: (n: string, d?: object) => void } }).umami;
    u?.track(name, data);
  } catch {
    /* analytics must never break the tool */
  }
}

function reducedMotion(): boolean {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/* ---------------- storage ---------------- */

function sanitize(raw: unknown): { step: Step; items: Item[]; nextId: number } | null {
  if (!raw || typeof raw !== 'object') return null;
  const d = raw as Record<string, unknown>;
  if (!Array.isArray(d.items)) return null;
  const items: Item[] = [];
  const seen = new Set<string>();
  for (const r of d.items.slice(0, MAX_ITEMS)) {
    if (!r || typeof r !== 'object') continue;
    const o = r as Record<string, unknown>;
    const name = typeof o.name === 'string' ? o.name.trim().slice(0, MAX_LEN) : '';
    if (!name || seen.has(name.toLowerCase())) continue;
    seen.add(name.toLowerCase());
    const energy = typeof o.energy === 'number' && [-2, -1, 0, 1, 2].includes(o.energy) ? o.energy : null;
    const imp = o.imp === 'hi' || o.imp === 'lo' ? o.imp : null;
    items.push({ id: items.length + 1, name, energy, imp });
  }
  if (!items.length) return null;
  let step = typeof d.step === 'number' && [1, 2, 3].includes(d.step) ? (d.step as Step) : 1;
  if (step >= 2 && items.length < MIN_ITEMS) step = 1;
  if (step === 3 && items.some((it) => !isScored(it))) step = 2;
  return { step, items, nextId: items.length + 1 };
}

function readStore(): ReturnType<typeof sanitize> {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? sanitize(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

function writeStore(s: State): void {
  if (s.example) return;
  try {
    if (!s.items.length) {
      window.localStorage.removeItem(KEY);
      return;
    }
    window.localStorage.setItem(
      KEY,
      JSON.stringify({ v: 1, step: s.step, items: s.items.map(({ name, energy, imp }) => ({ name, energy, imp })) }),
    );
  } catch {
    /* storage blocked or full: the tool still works for this visit */
  }
}

function clearStore(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

/* ---------------- app ---------------- */

function init(root: HTMLElement): void {
  const app = root.querySelector<HTMLElement>('[data-ea-app]');
  const status = root.querySelector<HTMLElement>('[data-ea-status]');
  if (!app || !status) return;

  const stored = readStore();
  const state: State = {
    step: 0,
    items: [],
    nextId: 1,
    example: false,
    draft: '',
    error: '',
    scoreMsg: '',
    toast: '',
    toastKind: 'ok',
    confirm: false,
    resume: stored,
  };
  let completedOnce = false;
  let toastTimer = 0;

  const announce = (msg: string) => {
    status.textContent = '';
    window.setTimeout(() => {
      status.textContent = msg;
    }, 60);
  };

  const mutate = (fn: () => void) => {
    fn();
    state.example = false;
    writeStore(state);
  };

  const unscoredCount = () => state.items.filter((it) => !isScored(it)).length;

  function goTo(step: Step, opts: { focus?: boolean } = {}) {
    state.step = step;
    state.scoreMsg = '';
    state.toast = '';
    state.confirm = false;
    writeStore(state);
    render();
    if (opts.focus !== false) {
      const heading = app!.querySelector<HTMLElement>('[data-ea-heading]');
      if (heading) {
        heading.focus({ preventScroll: true });
        const top = root.getBoundingClientRect().top + window.scrollY - 24;
        if (root.getBoundingClientRect().top < 0) {
          window.scrollTo({ top, behavior: reducedMotion() ? 'auto' : 'smooth' });
        }
      }
    }
  }

  function startAudit() {
    state.items = [];
    state.nextId = 1;
    state.example = false;
    state.resume = null;
    state.draft = '';
    state.error = '';
    track('lab_start', { mode: 'own' });
    goTo(1);
  }

  function loadExample() {
    state.items = EXAMPLE.map(([name, energy, imp], i) => ({ id: i + 1, name, energy, imp }));
    state.nextId = EXAMPLE.length + 1;
    state.example = true;
    state.resume = null;
    state.draft = '';
    state.error = '';
    track('lab_start', { mode: 'example' });
    goTo(3);
    announce('Example week loaded. Your energy map is below.');
  }

  function continueStored() {
    if (!state.resume) return;
    state.items = state.resume.items;
    state.nextId = state.resume.nextId;
    state.example = false;
    const step = state.resume.step;
    state.resume = null;
    goTo(step);
  }

  function startFresh() {
    clearStore();
    state.resume = null;
    state.items = [];
    state.nextId = 1;
    render();
    app!.querySelector<HTMLElement>('[data-ea-start]')?.focus();
  }

  function addItem() {
    const input = app!.querySelector<HTMLInputElement>('#ea-activity');
    const name = (input?.value ?? state.draft).trim();
    state.draft = input?.value ?? state.draft;
    if (!name) {
      input?.focus();
      return;
    }
    if (name.length > MAX_LEN) state.error = "That's a bit long. Keep it under 60 characters.";
    else if (state.items.length >= MAX_ITEMS) state.error = "That's 15. Remove one to add another.";
    else if (state.items.some((it) => it.name.toLowerCase() === name.toLowerCase())) state.error = "That's already on your list.";
    else {
      mutate(() => {
        state.items = state.items.concat([{ id: state.nextId, name, energy: null, imp: null }]);
        state.nextId += 1;
      });
      state.draft = '';
      state.error = '';
    }
    render();
    app!.querySelector<HTMLInputElement>('#ea-activity')?.focus();
  }

  function removeItem(id: number) {
    const idx = state.items.findIndex((it) => it.id === id);
    const removed = state.items[idx];
    mutate(() => {
      state.items = state.items.filter((it) => it.id !== id);
    });
    state.error = '';
    render();
    const buttons = app!.querySelectorAll<HTMLButtonElement>('[data-ea-remove]');
    const next = buttons[Math.min(idx, buttons.length - 1)];
    (next ?? app!.querySelector<HTMLInputElement>('#ea-activity'))?.focus();
    if (removed) announce(`Removed ${removed.name}. ${state.items.length} of 15.`);
  }

  function setScore(id: number, patch: Partial<Item>, group: HTMLElement) {
    mutate(() => {
      state.items = state.items.map((it) => (it.id === id ? { ...it, ...patch } : it));
    });
    state.scoreMsg = '';
    const it = state.items.find((x) => x.id === id);
    group.querySelectorAll<HTMLButtonElement>('button').forEach((b) => {
      const on = 'energy' in patch ? Number(b.dataset.value) === it?.energy : b.dataset.value === it?.imp;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    const row = group.closest<HTMLElement>('[data-ea-row]');
    if (row && it) row.classList.toggle('is-scored', isScored(it));
    updateScoreMsg();
  }

  function updateScoreMsg() {
    const msg = app!.querySelector<HTMLElement>('[data-ea-score-msg]');
    if (!msg) return;
    const left = unscoredCount();
    const text = state.scoreMsg || (left > 0 ? `${left} left to score` : 'All scored');
    msg.textContent = text;
    msg.classList.toggle('is-error', Boolean(state.scoreMsg));
  }

  function toMap() {
    const left = unscoredCount();
    if (left > 0) {
      state.scoreMsg = `Score every item to see your map. ${left} left.`;
      updateScoreMsg();
      const first = state.items.find((it) => !isScored(it));
      if (first) {
        const row = app!.querySelector<HTMLElement>(`[data-ea-row="${first.id}"]`);
        const target =
          first.energy === null
            ? row?.querySelector<HTMLButtonElement>('[data-ea-energy] button')
            : row?.querySelector<HTMLButtonElement>('[data-ea-imp] button');
        target?.focus();
      }
      return;
    }
    if (!state.example && !completedOnce) {
      completedOnce = true;
      track('lab_complete', { mode: 'own', items: state.items.length });
    }
    goTo(3);
    announce(mapSummary());
  }

  function showToast(text: string, kind: 'ok' | 'err') {
    state.toast = text;
    state.toastKind = kind;
    const el = app!.querySelector<HTMLElement>('[data-ea-toast]');
    if (el) renderToast(el);
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      state.toast = '';
      const t = app!.querySelector<HTMLElement>('[data-ea-toast]');
      if (t) renderToast(t);
    }, kind === 'ok' ? 4000 : 6000);
  }

  function renderToast(el: HTMLElement) {
    el.replaceChildren();
    el.classList.toggle('is-error', state.toastKind === 'err');
    if (!state.toast) return;
    el.append(svgIcon(state.toastKind === 'ok' ? ICON.check : ICON.warn, 16), document.createTextNode(state.toast));
  }

  async function saveImage() {
    try {
      const blob = await renderMapImage(state.items, tipsFor(state.items));
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'my-energy-map.png';
      document.body.append(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 4000);
      showToast('Saved. Check your downloads.', 'ok');
      track('lab_save', { mode: state.example ? 'example' : 'own', items: state.items.length });
    } catch {
      showToast("Couldn't save the image. Try again, or take a screenshot.", 'err');
    }
  }

  function askReset() {
    state.confirm = true;
    render();
    app!.querySelector<HTMLButtonElement>('[data-ea-keep]')?.focus();
  }

  function keepList() {
    state.confirm = false;
    render();
    app!.querySelector<HTMLButtonElement>('[data-ea-reset]')?.focus();
  }

  function doReset() {
    clearStore();
    state.items = [];
    state.nextId = 1;
    state.example = false;
    state.draft = '';
    state.error = '';
    state.confirm = false;
    completedOnce = false;
    goTo(1);
    announce('Your list is cleared. Start a new one.');
  }

  function mapSummary(): string {
    const counts = countQuads(state.items);
    const parts = (['Protect', 'Redesign', 'Enjoy, within limits', 'Drop'] as Quad[])
      .filter((q) => counts[q])
      .map((q) => `${counts[q]} in ${q}`);
    return `Your energy map is ready: ${parts.join(', ')}.`;
  }

  /* ---------- views ---------- */

  function progress(): HTMLElement {
    return h(
      'div',
      { class: 'ea-progress' },
      h('span', { class: 'lbl lbl--sm muted', text: `Step ${state.step} of 3` }),
      h(
        'div',
        { class: 'ea-progress__bar', 'aria-hidden': 'true' },
        ...[1, 2, 3].map((n) => h('span', { class: n <= state.step ? 'is-on' : '' })),
      ),
    );
  }

  function previewMap(): HTMLElement {
    const cell = (label: string, hl = false) =>
      h('div', { class: 'ea-preview__q' + (hl ? ' is-hl' : '') }, h('span', { class: 'lbl lbl--sm', text: label }));
    return h(
      'div',
      { class: 'ea-preview', 'aria-hidden': 'true' },
      cell('Redesign'),
      cell('Protect', true),
      cell('Drop'),
      cell('Enjoy, within limits'),
    );
  }

  function viewIntro(): HTMLElement {
    const actions = state.resume
      ? h(
          'div',
          { class: 'ea-intro__copy' },
          h('h2', { class: 'd ea-h2 ea-h2--sm', tabindex: '-1', 'data-ea-heading': '', text: 'Pick up where you left off?' }),
          h(
            'div',
            { class: 'ea-actions' },
            h('button', { type: 'button', class: 'btn btn-p', onClick: continueStored, 'data-ea-start': '' }, 'Continue'),
            h('button', { type: 'button', class: 'btn btn-s', onClick: startFresh }, 'Start fresh'),
          ),
        )
      : h(
          'div',
          { class: 'ea-intro__copy' },
          h(
            'div',
            { class: 'ea-actions' },
            h('button', { type: 'button', class: 'btn btn-p', onClick: startAudit, 'data-ea-start': '' }, 'Start the audit'),
            h('button', { type: 'button', class: 'ea-linkbtn ul', onClick: loadExample }, 'Try it with an example week'),
          ),
        );
    return h('div', { class: 'ea-intro' }, actions, previewMap());
  }

  function viewList(): HTMLElement {
    const n = state.items.length;
    const input = h('input', {
      id: 'ea-activity',
      class: 'ea-input' + (state.error ? ' is-error' : ''),
      type: 'text',
      autocomplete: 'off',
      enterkeyhint: 'done',
      placeholder: 'e.g. Monday team meeting',
      'aria-describedby': 'ea-activity-msg',
      'aria-invalid': state.error ? 'true' : 'false',
      maxlength: '200',
    }) as HTMLInputElement;
    input.value = state.draft;
    input.addEventListener('input', () => {
      state.draft = input.value;
      if (state.error) {
        state.error = '';
        input.classList.remove('is-error');
        input.setAttribute('aria-invalid', 'false');
        const err = app!.querySelector<HTMLElement>('[data-ea-error]');
        err?.replaceChildren();
      }
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addItem();
      }
    });

    const error = h('span', { class: 'ea-error', 'data-ea-error': '' });
    if (state.error) error.append(svgIcon(ICON.warn, 16), document.createTextNode(state.error));

    const list = h(
      'ul',
      { class: 'ea-chips', role: 'list' },
      ...state.items.map((it) =>
        h(
          'li',
          { class: 'ea-chip' },
          h('span', { class: 'ea-chip__name', text: it.name }),
          h(
            'button',
            {
              type: 'button',
              class: 'ea-chip__x',
              'aria-label': `Remove ${it.name}`,
              'data-ea-remove': '',
              onClick: () => removeItem(it.id),
            },
            svgIcon(ICON.close, 16),
          ),
        ),
      ),
    );

    const next = h(
      'button',
      { type: 'button', class: 'btn btn-p', disabled: n < MIN_ITEMS, onClick: () => n >= MIN_ITEMS && goTo(2) },
      'Next: score them',
    );

    return h(
      'div',
      { class: 'ea-step' },
      progress(),
      h(
        'div',
        { class: 'ea-step__head' },
        h('h2', { class: 'd ea-h2', tabindex: '-1', 'data-ea-heading': '', text: 'What fills your week?' }),
        h('p', { class: 'ea-hint', text: 'Add 5 to 15 things you do in a typical week. Work, home, anything that takes real time.' }),
      ),
      h(
        'div',
        { class: 'ea-field' },
        h('label', { for: 'ea-activity', class: 'ea-label', text: 'Activity' }),
        h(
          'div',
          { class: 'ea-field__row' },
          input,
          h('button', { type: 'button', class: 'btn btn-s ea-add', onClick: addItem }, 'Add'),
        ),
        h(
          'div',
          { id: 'ea-activity-msg', class: 'ea-msg', 'aria-live': 'polite' },
          error,
          h('span', { class: 'lbl lbl--sm muted ea-count', text: `${n} of 15` }),
        ),
      ),
      n === 0
        ? h('p', { class: 'ea-empty', text: 'Nothing here yet. Start with the thing that took the most time last week.' })
        : list,
      n >= MIN_ITEMS && n < NUDGE_BELOW
        ? h('p', { class: 'ea-hint ea-nudge', text: `You can go on with ${n}, but 5 or more gives a clearer map.` })
        : null,
      h('div', { class: 'ea-foot ea-foot--end' }, next),
    );
  }

  function viewScore(): HTMLElement {
    const rows = state.items.map((it) => {
      const nameId = `ea-name-${it.id}`;
      const energy = h(
        'div',
        { class: 'ea-energy', role: 'group', 'aria-label': `Energy for ${it.name}`, 'data-ea-energy': '' },
        ...[-2, -1, 0, 1, 2].map((v) =>
          h(
            'button',
            {
              type: 'button',
              class: 'ea-opt',
              'data-value': String(v),
              'aria-pressed': it.energy === v ? 'true' : 'false',
              'aria-label': `${energyLabel(v)} ${ENERGY_NAMES[String(v)]}`,
            },
            energyLabel(v),
          ),
        ),
      );
      energy.querySelectorAll<HTMLButtonElement>('button').forEach((b) =>
        b.addEventListener('click', () => setScore(it.id, { energy: Number(b.dataset.value) }, energy)),
      );
      const imp = h(
        'div',
        { class: 'ea-imp', role: 'group', 'aria-label': `How much ${it.name} matters`, 'data-ea-imp': '' },
        ...([['hi', 'Matters a lot'], ['lo', 'Matters less']] as [Imp, string][]).map(([v, label]) =>
          h('button', { type: 'button', class: 'ea-pill', 'data-value': v, 'aria-pressed': it.imp === v ? 'true' : 'false' }, label),
        ),
      );
      imp.querySelectorAll<HTMLButtonElement>('button').forEach((b) =>
        b.addEventListener('click', () => setScore(it.id, { imp: b.dataset.value as Imp }, imp)),
      );
      return h(
        'li',
        { class: 'ea-row' + (isScored(it) ? ' is-scored' : ''), 'data-ea-row': String(it.id) },
        h('span', { class: 'ea-row__name', id: nameId, text: it.name }),
        h(
          'div',
          { class: 'ea-row__energy' },
          energy,
          h('div', { class: 'ea-scale-mini', 'aria-hidden': 'true' }, h('span', { text: 'Drained' }), h('span', { text: 'Energized' })),
        ),
        imp,
      );
    });

    return h(
      'div',
      { class: 'ea-step' },
      progress(),
      h('h2', { class: 'd ea-h2', tabindex: '-1', 'data-ea-heading': '', text: 'How does each one leave you feeling?' }),
      h(
        'div',
        { class: 'ea-score-head', 'aria-hidden': 'true' },
        h('span'),
        h('span', { class: 'ea-score-head__scale' }, h('span', { text: 'Drained' }), h('span', { text: 'Energized' })),
        h('span', { class: 'ea-score-head__imp', text: 'How much it matters' }),
      ),
      h('ul', { class: 'ea-rows', role: 'list' }, ...rows),
      h(
        'div',
        { class: 'ea-foot ea-foot--score' },
        h('button', { type: 'button', class: 'btn btn-s', onClick: () => goTo(1) }, 'Back to my list'),
        h(
          'div',
          { class: 'ea-foot__right' },
          h('span', { class: 'ea-score-msg', 'aria-live': 'polite', 'data-ea-score-msg': '' }),
          h('button', { type: 'button', class: 'btn btn-p', onClick: toMap }, 'See my map'),
        ),
      ),
    );
  }

  function viewMap(): HTMLElement {
    const scored = state.items.filter(isScored);
    const wide = window.matchMedia('(min-width: 900px)').matches;
    const placed = placeDots(scored, wide);
    const tips = tipsFor(state.items);
    const counts = countQuads(state.items);
    const quads = Object.keys(counts) as Quad[];

    const cells = (['Redesign', 'Protect', 'Drop', 'Enjoy, within limits'] as Quad[]).map((q) =>
      h('div', { class: 'ea-map__q ea-map__q--' + slug(q) }, h('span', { class: 'lbl lbl--sm', text: q })),
    );
    const dots = placed.dots.map((d, i) =>
      h(
        'span',
        {
          class: 'ea-dot' + (d.labelLeft ? ' is-label-left' : '') + (d.quad === 'Redesign' ? ' is-dark' : ''),
          style: { left: d.left + '%', top: d.top + 'px', background: QUAD_COLOR[d.quad], animationDelay: i * 40 + 'ms' },
        },
        h('span', { class: 'ea-dot__n', text: String(i + 1) }),
        h('span', { class: 'ea-dot__label', title: d.item.name, text: d.item.name }),
      ),
    );

    const legend = h(
      'ol',
      { class: 'ea-legend' },
      ...placed.dots.map((d) =>
        h(
          'li',
          {},
          h('span', { class: 'ea-legend__dot' + (d.quad === 'Redesign' ? ' is-dark' : ''), style: { background: QUAD_COLOR[d.quad] }, 'aria-hidden': 'true' }),
          h('span', { class: 'ea-legend__name', text: d.item.name }),
          h('span', { class: 'lbl lbl--sm muted ea-legend__q', text: d.quad }),
        ),
      ),
    );

    const tipCards = tips.map((t, i) =>
      h(
        'article',
        { class: 'ea-tip' + (i === 0 ? ' is-hl' : '') },
        h('span', { class: 'ea-tip__kind' }, svgIcon(t.icon, 22), h('span', { class: 'lbl lbl--sm clay', text: t.kind })),
        h('h4', { class: 'd ea-tip__title', text: t.title }),
        h('p', { class: 'ea-tip__body', text: t.body }),
      ),
    );

    const toast = h('span', { class: 'ea-toast', role: 'status', 'data-ea-toast': '' });
    renderToast(toast);

    const confirm = state.confirm
      ? h(
          'div',
          {
            class: 'ea-confirm',
            role: 'alertdialog',
            'aria-modal': 'false',
            'aria-labelledby': 'ea-reset-q',
            onKeydown: (e: KeyboardEvent) => {
              if (e.key === 'Escape') keepList();
            },
          },
          h('span', { id: 'ea-reset-q', class: 'ea-confirm__q', text: "Clear your list and start over? This can't be undone." }),
          h(
            'div',
            { class: 'ea-actions' },
            h('button', { type: 'button', class: 'btn btn-s', onClick: keepList, 'data-ea-keep': '' }, 'Keep my list'),
            h('button', { type: 'button', class: 'btn ea-btn-dark', onClick: doReset }, 'Clear and start over'),
          ),
        )
      : null;

    return h(
      'div',
      { class: 'ea-step ea-step--map' },
      progress(),
      h('h2', { class: 'd ea-h2', tabindex: '-1', 'data-ea-heading': '', text: 'Your energy map' }),
      h(
        'div',
        { class: 'ea-mapwrap' },
        h(
          'div',
          { class: 'ea-yaxis', 'aria-hidden': 'true' },
          h('span', { class: 'lbl lbl--sm', text: 'Matters a lot' }),
          h('span', { class: 'lbl lbl--sm muted', text: 'Matters less' }),
        ),
        h(
          'div',
          { class: 'ea-mapcol' },
          h(
            'div',
            {
              class: 'ea-map' + (reducedMotion() ? '' : ' is-animated'),
              role: 'img',
              'aria-label': `Energy map with ${scored.length} activities placed by energy and importance. ${mapSummary().replace('Your energy map is ready: ', '')}`,
              style: { height: placed.height + 'px' },
            },
            ...cells,
            ...dots,
          ),
          h(
            'div',
            { class: 'ea-xaxis', 'aria-hidden': 'true' },
            h('span', { class: 'lbl lbl--sm muted', text: 'Drains me' }),
            h('span', { class: 'lbl lbl--sm', text: 'Gives me energy' }),
          ),
        ),
      ),
      legend,
      scored.length > 0 && quads.length === 1
        ? h('p', { class: 'ea-note', text: `Everything landed in ${quads[0]}. Either it's been an unusual week, or it's worth scoring again on a harder one.` })
        : null,
      h(
        'section',
        { class: 'ea-tips', 'aria-labelledby': 'ea-tips-title' },
        h('h3', { id: 'ea-tips-title', class: 'd ea-h3', text: 'Three things to try this week' }),
        h('div', { class: 'ea-tips__grid' }, ...tipCards),
      ),
      h(
        'div',
        { class: 'ea-foot ea-foot--map' },
        h('button', { type: 'button', class: 'btn btn-p', onClick: saveImage }, 'Save as image'),
        h('button', { type: 'button', class: 'btn btn-s', onClick: () => goTo(2) }, 'Edit my scores'),
        h('button', { type: 'button', class: 'btn btn-s', onClick: askReset, 'data-ea-reset': '' }, 'Start over'),
        toast,
      ),
      confirm,
    );
  }

  function render() {
    const view =
      state.step === 1 ? viewList() : state.step === 2 ? viewScore() : state.step === 3 ? viewMap() : viewIntro();
    app!.replaceChildren(view);
    root.dataset.step = String(state.step);
    if (state.step === 2) updateScoreMsg();
  }

  // Re-place the dots when the layout switches between phone and desktop.
  let wasWide = window.matchMedia('(min-width: 900px)').matches;
  window.addEventListener('resize', () => {
    const wide = window.matchMedia('(min-width: 900px)').matches;
    if (wide !== wasWide) {
      wasWide = wide;
      if (state.step === 3) {
        const active = document.activeElement;
        render();
        if (active && !app!.contains(active)) (active as HTMLElement).focus?.();
      }
    }
  });

  root.classList.add('is-ready');
  render();
}

/* ---------------- map maths ---------------- */

interface Placed {
  item: Item;
  quad: Quad;
  left: number;
  top: number;
  labelLeft: boolean;
}

function slug(q: Quad): string {
  return q.toLowerCase().replace(/[^a-z]+/g, '-').replace(/-$/, '');
}

function countQuads(items: Item[]): Partial<Record<Quad, number>> {
  const c: Partial<Record<Quad, number>> = {};
  items.filter(isScored).forEach((it) => {
    const q = quadOf(it);
    c[q] = (c[q] ?? 0) + 1;
  });
  return c;
}

// x follows energy (from 8% at -2 to 92% at +2, 0 sits on the middle axis); each half (matters a lot,
// matters less) stacks its items in their own rows so labels never sit on top of each other.
function placeDots(items: Item[], wide: boolean): { dots: Placed[]; height: number } {
  const minGap = wide ? 30 : 30;
  const base = wide ? 440 : 340;
  const halves: Record<Imp, Item[]> = { hi: [], lo: [] };
  items.forEach((it) => halves[it.imp as Imp].push(it));
  (Object.keys(halves) as Imp[]).forEach((k) =>
    halves[k].sort((a, b) => (a.energy ?? 0) - (b.energy ?? 0) || a.id - b.id),
  );
  const maxHalf = Math.max(halves.hi.length, halves.lo.length, 1);
  const topPad = 56;
  const bottomPad = 48;
  const height = Math.max(base, 2 * (topPad + minGap * (maxHalf - 1) + 24));
  const half = height / 2;

  const dots: Placed[] = [];
  (['hi', 'lo'] as Imp[]).forEach((k) => {
    const list = halves[k];
    const start = k === 'hi' ? topPad : half + 28;
    const end = k === 'hi' ? half - 24 : height - bottomPad;
    const gap = list.length > 1 ? Math.min(40, (end - start) / (list.length - 1)) : 0;
    list.forEach((it, i) => {
      const left = 8 + (((it.energy ?? 0) + 2) / 4) * 84;
      dots.push({ item: it, quad: quadOf(it), left, top: start + i * gap, labelLeft: left > 50 });
    });
  });
  return { dots, height };
}

interface Tip {
  kind: string;
  title: string;
  body: string;
  icon: string;
}

function tipsFor(items: Item[]): Tip[] {
  const scored = items.filter(isScored);
  const byQuad = (q: Quad) => scored.filter((it) => quadOf(it) === q);
  const protect = byQuad('Protect').sort((a, b) => (b.energy ?? 0) - (a.energy ?? 0));
  const redesign = byQuad('Redesign').sort((a, b) => (a.energy ?? 0) - (b.energy ?? 0));
  const drop = byQuad('Drop').sort((a, b) => (a.energy ?? 0) - (b.energy ?? 0));
  return [
    protect.length
      ? { kind: 'Do more', title: 'Do more of: ' + protect[0].name, body: 'It gives you energy and it matters. Book time for it before the week fills up.', icon: ICON.plus }
      : { kind: 'Do more', title: 'Nothing here fuels you yet', body: 'Add one thing you enjoy that also moves your work forward, and score it.', icon: ICON.plus },
    redesign.length
      ? { kind: 'Redesign', title: 'Redesign: ' + redesign[0].name, body: "Change one thing about it this week: the time of day, the length, or who's in the room.", icon: ICON.pen }
      : { kind: 'Redesign', title: 'Nothing important is draining you', body: 'Good week.', icon: ICON.pen },
    drop.length
      ? { kind: 'Let go', title: 'Let go of: ' + drop[0].name, body: 'Cut it, batch it into one slot, or ask someone else to take it.', icon: ICON.minus }
      : { kind: 'Let go', title: 'Nothing to drop', body: 'Your week is leaner than most.', icon: ICON.minus },
  ];
}

/* ---------------- save as image ---------------- */

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, hgt: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + hgt, r);
  ctx.arcTo(x + w, y + hgt, x, y + hgt, r);
  ctx.arcTo(x, y + hgt, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function fit(ctx: CanvasRenderingContext2D, text: string, maxW: number): string {
  if (ctx.measureText(text).width <= maxW) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(t + '…').width > maxW) t = t.slice(0, -1);
  return t.trimEnd() + '…';
}

async function renderMapImage(items: Item[], tips: Tip[]): Promise<Blob> {
  try {
    await Promise.all([
      document.fonts.load(`700 48px ${FONT_DISPLAY}`),
      document.fonts.load(`500 22px ${FONT_DISPLAY}`),
      document.fonts.load(`500 15px ${FONT_BODY}`),
      document.fonts.load(`500 12px ${FONT_MONO}`),
    ]);
  } catch {
    /* fall back to system fonts */
  }
  const W = 1200;
  const P = 64;
  const mapW = W - 2 * P - 36;
  const scored = items.filter(isScored);
  const placed = placeDots(scored, true);
  const mapH = placed.height + 40;
  const tipsY0 = 160 + mapH + 70;
  const tipW = (W - 2 * P - 2 * 20) / 3;

  const measure = document.createElement('canvas').getContext('2d');
  if (!measure) throw new Error('no canvas');
  measure.font = `400 15px ${FONT_BODY}`;
  const tipBodyLines = tips.map((t) => wrap(measure, t.body, tipW - 48));
  measure.font = `500 22px ${FONT_DISPLAY}`;
  const tipTitleLines = tips.map((t) => wrap(measure, t.title, tipW - 48));
  const tipH = Math.max(...tips.map((_, i) => 70 + tipTitleLines[i].length * 28 + 12 + tipBodyLines[i].length * 22)) + 24;
  const H = tipsY0 + 56 + tipH + 96;

  const scale = 2;
  const canvas = document.createElement('canvas');
  canvas.width = W * scale;
  canvas.height = H * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('no canvas');
  ctx.scale(scale, scale);

  ctx.fillStyle = '#FFF8EC';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#1F2226';
  ctx.textBaseline = 'alphabetic';
  ctx.font = `500 13px ${FONT_MONO}`;
  ctx.fillStyle = '#8A5A3B';
  ctx.fillText('ENERGY AUDIT', P, P + 8);
  ctx.fillStyle = '#1F2226';
  ctx.font = `700 52px ${FONT_DISPLAY}`;
  ctx.fillText('My energy map', P, P + 70);

  // map
  const mx = P + 36;
  const my = 160;
  const mh = mapH;
  ctx.lineWidth = 1.5;
  const qx = [mx, mx + mapW / 2];
  const qy = [my, my + mh / 2];
  const fills: Record<string, string> = { '0,0': '#FFF8EC', '1,0': '#FFE6A3', '0,1': '#FFF8EC', '1,1': '#FFF8EC' };
  ctx.save();
  roundRect(ctx, mx, my, mapW, mh, 16);
  ctx.clip();
  for (let cx = 0; cx < 2; cx++)
    for (let cy = 0; cy < 2; cy++) {
      ctx.fillStyle = fills[`${cx},${cy}`];
      ctx.fillRect(qx[cx], qy[cy], mapW / 2, mh / 2);
    }
  ctx.restore();
  ctx.strokeStyle = '#1F2226';
  ctx.setLineDash([4, 4]);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(mx + mapW / 2, my);
  ctx.lineTo(mx + mapW / 2, my + mh);
  ctx.moveTo(mx, my + mh / 2);
  ctx.lineTo(mx + mapW, my + mh / 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.lineWidth = 1.5;
  roundRect(ctx, mx, my, mapW, mh, 16);
  ctx.stroke();

  ctx.font = `500 12px ${FONT_MONO}`;
  ctx.fillStyle = '#1F2226';
  ctx.textAlign = 'left';
  ctx.fillText('REDESIGN', mx + 16, my + 26);
  ctx.fillText('DROP', mx + 16, my + mh - 16);
  ctx.textAlign = 'right';
  ctx.fillText('PROTECT', mx + mapW - 16, my + 26);
  ctx.fillText('ENJOY, WITHIN LIMITS', mx + mapW - 16, my + mh - 16);

  const offset = (mh - placed.height) / 2;
  placed.dots.forEach((d) => {
    const x = mx + (d.left / 100) * mapW;
    const y = my + offset + d.top;
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fillStyle = QUAD_COLOR[d.quad];
    ctx.fill();
    ctx.strokeStyle = '#1F2226';
    ctx.stroke();
    ctx.font = `500 14px ${FONT_BODY}`;
    const label = fit(ctx, d.item.name, mapW / 2 - 60);
    const tw = ctx.measureText(label).width;
    const lx = d.labelLeft ? x - 16 - tw : x + 16;
    ctx.fillStyle = 'rgba(255,255,255,0.88)';
    roundRect(ctx, lx - 5, y - 11, tw + 10, 22, 5);
    ctx.fill();
    ctx.fillStyle = '#1F2226';
    ctx.textAlign = 'left';
    ctx.fillText(label, lx, y + 5);
  });

  // axes
  ctx.font = `500 12px ${FONT_MONO}`;
  ctx.fillStyle = '#5E6168';
  ctx.textAlign = 'left';
  ctx.fillText('DRAINS ME', mx, my + mh + 26);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#1F2226';
  ctx.fillText('GIVES ME ENERGY', mx + mapW, my + mh + 26);
  ctx.save();
  ctx.translate(P + 12, my + 8);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#1F2226';
  ctx.fillText('MATTERS A LOT', 0, 0);
  ctx.restore();
  ctx.save();
  ctx.translate(P + 12, my + mh - 8);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#5E6168';
  ctx.fillText('MATTERS LESS', 0, 0);
  ctx.restore();

  // tips
  ctx.textAlign = 'left';
  ctx.fillStyle = '#1F2226';
  ctx.font = `500 28px ${FONT_DISPLAY}`;
  ctx.fillText('Three things to try this week', P, tipsY0 + 30);
  tips.forEach((t, i) => {
    const x = P + i * (tipW + 20);
    const y = tipsY0 + 56;
    roundRect(ctx, x, y, tipW, tipH, 16);
    ctx.fillStyle = i === 0 ? '#FFE6A3' : '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#1F2226';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.font = `500 12px ${FONT_MONO}`;
    ctx.fillStyle = '#8A5A3B';
    ctx.fillText(t.kind.toUpperCase(), x + 24, y + 36);
    ctx.fillStyle = '#1F2226';
    ctx.font = `500 22px ${FONT_DISPLAY}`;
    let ty = y + 72;
    tipTitleLines[i].forEach((ln) => {
      ctx.fillText(ln, x + 24, ty);
      ty += 28;
    });
    ty += 8;
    ctx.font = `400 15px ${FONT_BODY}`;
    tipBodyLines[i].forEach((ln) => {
      ctx.fillText(ln, x + 24, ty);
      ty += 22;
    });
  });

  ctx.font = `500 12px ${FONT_MONO}`;
  ctx.fillStyle = '#5E6168';
  ctx.fillText('LEOLAMNGUYEN.NETLIFY.APP/LAB/ENERGY-AUDIT', P, H - 40);

  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png');
  });
}

/* ---------------- boot ---------------- */

document.querySelectorAll<HTMLElement>('[data-ea-root]').forEach((root) => {
  try {
    init(root);
  } catch (e) {
    root.classList.add('is-broken');
    console.error(e);
  }
});
