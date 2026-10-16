export interface RevealItem {
  el: HTMLElement;
  from: number;
  to: number;
}

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));

export function makeReveal(items: RevealItem[]) {
  const prepared = items.map(({ el, from, to }) => {
    const text = el.getAttribute('data-word') || el.textContent || '';
    el.setAttribute('data-word', text);
    el.textContent = '';
    el.style.display = 'flex';
    el.style.flexDirection = 'row';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.style.whiteSpace = 'nowrap';
    const letters = [...text].map((ch) => {
      const s = document.createElement('span');
      s.textContent = ch === ' ' ? '\u00A0' : ch;
      s.style.display = 'inline-block';
      s.style.opacity = '0';
      s.style.transform = 'translateY(10px)';
      s.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
      el.appendChild(s);
      return s;
    });
    return { letters, from, to, el };
  });

  return (travel: number, isActive: boolean) => {
    // Loop progress between 0 and 1
    const p = travel - Math.floor(travel);

    prepared.forEach(({ letters, from, to, el }) => {
      if (!isActive || p < from || p > to) {
        el.style.opacity = '0';
        letters.forEach((s) => {
          s.style.opacity = '0';
          s.style.transform = 'translateY(10px)';
        });
        return;
      }

      el.style.opacity = '1';
      const t = clamp((p - from) / (to - from));
      const n = letters.length;
      const fadeOut = t > 0.88 ? clamp(1 - (t - 0.88) / 0.12) : 1;

      letters.forEach((s, i) => {
        const threshold = i / n;
        const letterT = clamp((t - threshold * 0.7) / 0.3);
        const alpha = letterT * fadeOut;
        s.style.opacity = alpha.toFixed(3);
        s.style.transform = `translateY(${((1 - letterT) * 8).toFixed(1)}px)`;
      });
    });
  };
}
