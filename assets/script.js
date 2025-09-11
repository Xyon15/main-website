// Met à jour l'année du footer et applique un thème basé sur assets/images/color.png
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    const img = document.getElementById('palette-image');
    if (!img) return;

    if ((img).complete && (img).naturalWidth > 0) {
      tryExtract(img);
    } else {
      img.addEventListener('load', () => tryExtract(img), { once: true });
      img.addEventListener('error', () => console.warn('[Palette] Impossible de charger color.png'));
    }
  });

  function tryExtract(img) {
    try {
      const { from, to, accent, theme } = extractGradientFromImage(img);
      applyTheme({ from, to, accent, theme });
    } catch (e) {
      console.warn('[Palette] Extraction échouée:', e);
    }
  }

  function applyTheme({ from, to, accent, theme }) {
    const root = document.documentElement;
    if (from) root.style.setProperty('--gradient-from', from);
    if (to) root.style.setProperty('--gradient-to', to);
    if (accent) root.style.setProperty('--accent', accent);

    // Définir meta theme-color pour les navigateurs mobiles
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta && theme) meta.setAttribute('content', theme);
  }

  function extractGradientFromImage(img) {
    const w = Math.max(16, Math.min(128, img.naturalWidth || img.width || 0));
    const h = Math.max(16, Math.min(128, img.naturalHeight || img.height || 0));

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Contexte 2D indisponible');

    ctx.drawImage(img, 0, 0, w, h);
    const { data } = ctx.getImageData(0, 0, w, h);

    // Histogramme quantifié (4 bits par canal => 4096 bacs)
    const buckets = new Map();
    const step = 2; // échantillonnage 1 pixel sur 2 pour la vitesse

    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const i = (y * w + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        if (a < 128) continue; // ignore pixels transparents

        const qr = r >> 4, qg = g >> 4, qb = b >> 4;
        const key = (qr << 8) | (qg << 4) | qb;
        let entry = buckets.get(key);
        if (!entry) {
          entry = { count: 0, rSum: 0, gSum: 0, bSum: 0 };
          buckets.set(key, entry);
        }
        entry.count++;
        entry.rSum += r; entry.gSum += g; entry.bSum += b;
      }
    }

    const candidates = Array.from(buckets.entries())
      .map(([key, v]) => {
        const r = Math.round(v.rSum / v.count);
        const g = Math.round(v.gSum / v.count);
        const b = Math.round(v.bSum / v.count);
        const { s, l } = rgbToHsl(r, g, b);
        return { key, count: v.count, r, g, b, s, l, hex: rgbToHex(r, g, b) };
      })
      .filter(c => c.count > 2) // supprime le bruit
      .sort((a, b) => b.count - a.count);

    if (candidates.length < 2) {
      return { from: '#7c3aed', to: '#06b6d4', accent: '#7c3aed', theme: '#0b1020' };
    }

    // Favorise couleurs saturées et non extrêmes en luminosité
    const top = candidates.slice(0, 24).sort((a, b) => (b.s - a.s) || (a.l - b.l));

    let primary = top[0];
    for (const c of top) {
      if (c.s >= 0.25 && c.l > 0.15 && c.l < 0.8) { primary = c; break; }
    }

    // Cherche une couleur secondaire la plus distante de la primaire
    let secondary = top[1] || candidates[1];
    let bestDist = -1;
    for (const c of top) {
      const d = colorDistance(primary, c);
      if (c !== primary && d > bestDist && d > 80) { bestDist = d; secondary = c; }
    }
    // Si trop proche, fallback sur une autre liste plus large
    if (!secondary || colorDistance(primary, secondary) < 60) {
      for (const c of candidates.slice(0, 64)) {
        const d = colorDistance(primary, c);
        if (c !== primary && d > 80) { secondary = c; break; }
      }
    }

    // Accent = la plus saturée des deux
    const accent = (primary.s >= (secondary?.s || 0)) ? primary : secondary;

    // Theme color légèrement assombrie pour la barre d'adresse
    const theme = mixColors('#0b1020', primary.hex, 0.3);

    return { from: primary.hex, to: secondary?.hex || mixColors(primary.hex, '#ffffff', 0.35), accent: accent.hex, theme };
  }

  // Utilitaires couleur
  function rgbToHex(r, g, b) { return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join(''); }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0; const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h, s, l };
  }

  function colorDistance(a, b) { // Euclidienne en RGB
    const dr = a.r - b.r, dg = a.g - b.g, db = a.b - b.b;
    return Math.sqrt(dr*dr + dg*dg + db*db);
  }

  function hexToRgb(hex) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : { r: 0, g: 0, b: 0 };
  }

  function mixColors(hexA, hexB, t) { // 0..1, mélange linéaire
    const A = hexToRgb(hexA), B = hexToRgb(hexB);
    const r = Math.round(A.r + (B.r - A.r) * t);
    const g = Math.round(A.g + (B.g - A.g) * t);
    const b = Math.round(A.b + (B.b - A.b) * t);
    return rgbToHex(r, g, b);
  }
})();