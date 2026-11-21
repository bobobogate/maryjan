const menuButton = document.querySelector('[data-menu-button]');
const nav = document.querySelector('[data-nav]');

function closeMenu() {
  if (!menuButton || !nav) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', '開啟選單');
  nav.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? '關閉選單' : '開啟選單');
  nav?.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const dialog = document.querySelector('[data-lightbox-dialog]');
const dialogImage = dialog?.querySelector('[data-lightbox-image]');
const dialogCaption = dialog?.querySelector('[data-lightbox-caption]');

function openArtwork(trigger) {
  const source = trigger.dataset.lightbox;
  if (!source) return;

  if (!dialog || !dialogImage || !dialogCaption || typeof dialog.showModal !== 'function') {
    window.open(source, '_blank', 'noopener,noreferrer');
    return;
  }

  dialogImage.src = source;
  dialogImage.alt = trigger.querySelector('img')?.alt || '';
  dialogCaption.textContent = trigger.dataset.caption || '';
  if (!dialog.open) dialog.showModal();
}

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-lightbox]');
  if (trigger) {
    openArtwork(trigger);
    return;
  }

  const caption = event.target.closest('.work figcaption, .hero-art figcaption');
  const artwork = caption?.closest('figure')?.querySelector('[data-lightbox]');
  if (artwork) openArtwork(artwork);
});

dialog?.querySelector('[data-lightbox-close]')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

document.querySelectorAll('.art-open img, [data-lightbox-image]').forEach((image) => {
  image.draggable = false;
});

document.addEventListener('contextmenu', (event) => {
  if (event.target.closest('.art-open, [data-lightbox-dialog]')) event.preventDefault();
});
