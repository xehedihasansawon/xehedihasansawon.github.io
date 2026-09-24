const menuButton = document.getElementById('menuButton');
const mobileNav = document.getElementById('mobileNav');

const closeMobileNav = () => {
  if (!mobileNav || !menuButton) return;
  mobileNav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
};

menuButton?.addEventListener('click', () => {
  const open = mobileNav?.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(Boolean(open)));
});

mobileNav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMobileNav);
});

const lightbox = document.getElementById('caseLightbox');
const lightboxImage = document.getElementById('caseLightboxImage');
const closeButton = document.getElementById('caseLightboxClose');
let lastLightboxTrigger = null;

document.querySelectorAll('[data-lightbox]').forEach(button => {
  button.setAttribute('aria-haspopup', 'dialog');

  button.addEventListener('click', () => {
    lastLightboxTrigger = button;
    lightboxImage.src = button.dataset.lightbox;
    lightboxImage.alt = button.querySelector('img')?.alt || 'Project artwork';
    lightbox.showModal();
  });
});

closeButton?.addEventListener('click', () => lightbox.close());
lightbox?.addEventListener('click', event => {
  if (event.target === lightbox) lightbox.close();
});

lightbox?.addEventListener('close', () => {
  if (lastLightboxTrigger) lastLightboxTrigger.focus();
});

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;

  if (lightbox?.open) {
    lightbox.close();
    return;
  }

  if (mobileNav?.classList.contains('open')) {
    closeMobileNav();
    menuButton?.focus();
  }
});
