/* ==========================================================================
   Zensical / Material Content Font Resizer (Inline SVGs in TOC)
   ========================================================================== */

(function () {
  const STORAGE_KEY = 'zensical_font_scale_index';
  // Beschikbare schalen: 85%, 100% (standaard), 115%, 130%
  const SCALES = [0.85, 1.0, 1.15, 1.30];
  
  let currentIndex = parseInt(localStorage.getItem(STORAGE_KEY) || '1', 10);

  // Pas de schaal toe op de CSS-variabele
  function applyScale(index) {
    currentIndex = Math.max(0, Math.min(index, SCALES.length - 1));
    const scale = SCALES[currentIndex];
    
    document.documentElement.style.setProperty('--content-font-scale', scale);
    localStorage.setItem(STORAGE_KEY, currentIndex);
  }

  // Injecteer de knoppen direct bovenaan de TOC-sidebar (boven de titel)
  function injectWidgetInTOC() {
    // Oude zwevende widget opruimen indien aanwezig
    const oldFloatingWidget = document.getElementById('font-size-widget');
    if (oldFloatingWidget) oldFloatingWidget.remove();

    // Zoek het navigatieblok van de TOC (rechterkolom)
    const tocContainer = document.querySelector('.md-sidebar--secondary .md-nav--secondary');
    if (!tocContainer) return; // Pagina heeft geen TOC

    // Voorkom dubbele injectie bij Instant Loading
    if (tocContainer.querySelector('.font-size-toc-container')) return;

    const widgetWrapper = document.createElement('div');
    widgetWrapper.className = 'font-size-toc-container';

    // Inline Lucide SVG iconen: a-arrow-down, rotate-ccw, a-arrow-up
    const iconArrowDown = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-a-arrow-down"><path d="M3.5 13h6"/><path d="m2 16 4.5-9 4.5 9"/><path d="M18 7v9"/><path d="m14 12 4 4 4-4"/></svg>`;
    const iconReset = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rotate-ccw"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`;
    const iconArrowUp = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-a-arrow-up"><path d="M3.5 13h6"/><path d="m2 16 4.5-9 4.5 9"/><path d="M18 17V8"/><path d="m14 12 4-4 4 4"/></svg>`;

    widgetWrapper.innerHTML = `
      <div class="font-size-buttons">
        <button type="button" class="font-size-btn" id="fs-decrease" title="Tekst verkleinen" aria-label="Tekst verkleinen">
          ${iconArrowDown}
        </button>
        <button type="button" class="font-size-btn" id="fs-reset" title="Herstellen naar 100%" aria-label="Herstellen naar 100%">
          ${iconReset}
        </button>
        <button type="button" class="font-size-btn" id="fs-increase" title="Tekst vergroten" aria-label="Tekst vergroten">
          ${iconArrowUp}
        </button>
      </div>
    `;

    // Injecteer direct boven de titel van de TOC
    const tocTitle = tocContainer.querySelector('.md-nav__title');
    if (tocTitle) {
      tocContainer.insertBefore(widgetWrapper, tocTitle);
    } else {
      tocContainer.prepend(widgetWrapper);
    }

    // Event listeners koppelen
    widgetWrapper.querySelector('#fs-decrease').addEventListener('click', function () {
      applyScale(currentIndex - 1);
    });
    
    widgetWrapper.querySelector('#fs-reset').addEventListener('click', function () {
      applyScale(1);
    });
    
    widgetWrapper.querySelector('#fs-increase').addEventListener('click', function () {
      applyScale(currentIndex + 1);
    });

    applyScale(currentIndex);
  }

  // Schaal direct toepassen bij het eerste laden
  applyScale(currentIndex);

  // Ondersteuning voor Zensical instant navigation
  if (typeof document$ !== 'undefined') {
    document$.subscribe(injectWidgetInTOC);
  } else {
    document.addEventListener('DOMContentLoaded', injectWidgetInTOC);
  }
})();