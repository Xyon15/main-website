// Met à jour l'année du footer et applique le thème fixe
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    // Thème forcé: couleurs fixes
    applyTheme({ from: '#7c3aed', to: '#06b6d4', accent: '#7c3aed', theme: '#0b1020' });
  });

  function applyTheme({ from, to, accent, theme }) {
    const root = document.documentElement;
    if (from) root.style.setProperty('--gradient-from', from);
    if (to) root.style.setProperty('--gradient-to', to);
    if (accent) root.style.setProperty('--accent', accent);

    // Définir meta theme-color pour les navigateurs mobiles
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta && theme) meta.setAttribute('content', theme);
  }
})();