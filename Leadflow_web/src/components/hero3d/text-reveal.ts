export interface RevealItem {
  el: HTMLElement;
  from: number;
  to: number;
}

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));

export function makeReveal(items: RevealItem[]) {
  const prepared = items.map(({ el, from, to }) => {
    const text = el.textContent || "";
    el.textContent = "";
    const letters = [...text].map((ch) => {
      const s = document.createElement("span");
      s.textContent = ch === " " ? "\u00A0" : ch;
      s.style.display = "inline-block";
      s.style.opacity = "0";
      s.style.willChange = "opacity, transform";
      el.appendChild(s);
      return s;
    });
    return { letters, from, to, el };
  });

  return (p: number, isHolding: boolean = true) => {
    prepared.forEach(({ letters, from, to, el }) => {
      // Hide completely if not holding or out of progress range
      if (!isHolding || p < from || p > to) {
        el.style.opacity = "0";
        letters.forEach((s) => {
          s.style.opacity = "0";
        });
        return;
      }

      el.style.opacity = "1";
      const t = clamp((p - from) / (to - from));
      const n = letters.length;
      const fadeOut = t > 0.9 ? 1 - (t - 0.9) / 0.1 : 1;

      letters.forEach((s, i) => {
        const alpha = clamp(t * (n + 2) - i) * fadeOut;
        s.style.opacity = String(alpha);
      });
    });
  };
}
