// Lightweight, non-blocking smooth scroll helper
export interface LenisOptions {
  lerp?: number;
}

export default class Lenis {
  constructor(_options: LenisOptions = {}) {
    if (typeof window !== "undefined") {
      document.documentElement.style.scrollBehavior = "smooth";
    }
  }

  public destroy() {
    if (typeof window !== "undefined") {
      document.documentElement.style.scrollBehavior = "auto";
    }
  }
}
