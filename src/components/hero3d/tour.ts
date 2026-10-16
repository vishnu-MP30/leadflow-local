// hero/tour.ts (state machine: idle | hold | tour | paused | return)

export type TourMode = 'idle' | 'hold' | 'tour' | 'paused' | 'return';

export interface TourState {
  mode: TourMode;
  travel: number;
  vel: number;
  tourEnd: number;
  idleSince: number;
}

export interface CreateTourOptions {
  onMode?: (mode: TourMode) => void;
}

export function createTour({ onMode }: CreateTourOptions = {}) {
  const S: TourState = {
    mode: 'idle',
    travel: 0,
    vel: 0,
    tourEnd: 0,
    idleSince: 0,
  };

  const V_TOUR = 1 / 30; // ~30 second tour loop
  const V_HOLD = 0.04;
  const V_RETURN = 0.025;
  const MIN_V = 0.006;

  const frac = (x: number) => x - Math.floor(x);
  const distToHero = (t: number) => {
    const f = frac(t);
    return Math.min(f, 1 - f);
  };

  const set = (m: TourMode) => {
    if (S.mode !== m) {
      S.mode = m;
      onMode?.(m);
    }
  };

  const landing = (rem: number, vmax: number) =>
    Math.max(MIN_V, vmax * Math.min(1, rem / 0.07));

  return {
    S,
    V_TOUR,
    V_HOLD,
    distToHero,
    frac,
    toggle() {
      if (S.mode === 'tour') {
        return set('paused');
      }
      if (S.mode !== 'paused') {
        S.tourEnd = Math.floor(S.travel + 1e-4) + 1;
      }
      set('tour');
    },
    pause() {
      if (S.mode === 'tour') set('paused');
    },
    resume() {
      if (S.mode === 'paused') set('tour');
    },
    holdStart() {
      if (S.mode !== 'tour') {
        set('hold');
      }
    },
    holdEnd(now: number) {
      if (S.mode === 'hold') {
        set('return');
        S.idleSince = now;
      }
    },
    update(dt: number, now: number) {
      if (S.mode === 'hold') {
        const target = V_HOLD;
        S.vel += (target - S.vel) * (1 - Math.exp(-3.5 * dt));
        S.travel += S.vel * dt;
        return S;
      }

      if (S.mode === 'return') {
        // Smoothly and swiftly glide back to hero section view (travel = 0)
        const diff = 0 - S.travel;
        if (Math.abs(diff) < 0.001 || S.travel <= 0.001) {
          S.travel = 0;
          S.vel = 0;
          set('idle');
          S.idleSince = now;
          return S;
        }
        const target = Math.max(-0.08, diff * 5.0);
        S.vel += (target - S.vel) * (1 - Math.exp(-6.0 * dt));
        S.travel += S.vel * dt;
        if (S.travel <= 0.001) {
          S.travel = 0;
          S.vel = 0;
          set('idle');
          S.idleSince = now;
        }
        return S;
      }

      if (S.mode === 'tour') {
        const remaining = S.tourEnd - S.travel;
        const target = landing(remaining, V_TOUR);
        S.vel += (target - S.vel) * (1 - Math.exp(-2.5 * dt));
        const next = S.travel + S.vel * dt;
        if (next >= S.tourEnd - 0.0005) {
          S.travel = 0;
          S.vel = 0;
          set('idle');
          S.idleSince = now;
          return S;
        }
        S.travel = next;
        return S;
      }

      // Idle mode
      S.vel = 0;
      return S;
    },
  };
}
