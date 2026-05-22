Hooks.on('renderTokenHUD', /** @param {HTMLFormElement} html */(_app, html) => {
  /** @type {HTMLDivElement} */
  const statusEffects = html.querySelector(".col.right .palette.status-effects");
  if (!statusEffects) return;
  statusEffects.classList.add("qss-status-effects");

  /** @type {HTMLInputElement | null} */
  let qssQuickInput = statusEffects.querySelector(".qss-quick-input");
  if (!qssQuickInput) {
    const qssQuickFilter = document.createElement('label');
    qssQuickFilter.classList.add("qss-quick-filter");

    const qssQuickLabel = document.createElement('span');
    qssQuickLabel.classList.add("qss-quick-label");
    qssQuickLabel.textContent = game.i18n.localize("quick-status-select.TokenHud.quick-input.label");

    qssQuickInput = document.createElement('input');
    qssQuickInput.type = "search";
    qssQuickInput.placeholder = game.i18n.localize("quick-status-select.TokenHud.quick-input.placeholder");
    qssQuickInput.classList.add("qss-quick-input");
    qssQuickFilter.append(qssQuickLabel, qssQuickInput);
    statusEffects.prepend(qssQuickFilter);
  }

  if (!qssQuickInput.dataset.qssListenersBound) {
    qssQuickInput.dataset.qssListenersBound = "true";

    qssQuickInput.addEventListener('input', () => {
      const term = qssQuickInput.value.trim().toLowerCase();
      /** @type {NodeListOf<HTMLElement>} */
      const effects = statusEffects.querySelectorAll('.effect-control');
      for (const effect of effects) {
        const id = effect.dataset.statusId?.trim().toLowerCase() ?? "";
        const labelSource = effect.dataset.tooltipText || (effect.dataset.tooltip ? game.i18n.localize(effect.dataset.tooltip) : "");
        const label = labelSource.trim().toLowerCase();
        effect.hidden = !(id.includes(term) || label.includes(term));
      }
      statusEffects.scrollTop = 0;
    });

    qssQuickInput.addEventListener('keydown', event => {
      debug('got keydown:', event.key, qssQuickInput.value);
      if (event.key === 'Enter' && qssQuickInput.value.trim()) {
        event.preventDefault();
        /** @type {NodeListOf<HTMLElement>} */
        const effects = statusEffects.querySelectorAll('.effect-control');
        for (const effect of effects) {
          if (!effect.hidden) {
            effect.click();
            break;
          }
        }
      }
    });
  }

  const effectsButton = html.querySelector("button[data-palette='effects']");
  if (effectsButton && !effectsButton.dataset.qssFocusBound) {
    effectsButton.dataset.qssFocusBound = "true";
    effectsButton.addEventListener('click', () => setTimeout(() => qssQuickInput.focus(), 0));
  }
});

// Debug logging helper
export function debug(msg, ...args) {
  if (!game.user?.isGM || !foundry.utils.getProperty(CONFIG, "debug.qss")) return;
  console.debug(`quick-status-select | ${msg}`, ...args);
}
