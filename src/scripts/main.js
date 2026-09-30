/**
 * Progressive enhancement only. Nothing here is required for the page to be
 * readable or navigable — content, links and the contact form all work with
 * this file blocked.
 */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

/* -------------------------------------------------------------------------
   Mobile menu
   ------------------------------------------------------------------------- */

function initMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const overlay = document.querySelector('[data-overlay]');
  if (!toggle || !overlay) return;

  const root = document.documentElement;
  const firstLink = overlay.querySelector('a');

  // The overlay is `hidden` at rest so its links stay out of the tab order and
  // out of the accessibility tree. Drop the attribute before the open
  // transition, and restore it after the close transition finishes.
  overlay.hidden = false;

  let isOpen = false;

  function open() {
    isOpen = true;
    root.dataset.menu = 'open';
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';
    firstLink?.focus();
  }

  function close({ restoreFocus = true } = {}) {
    if (!isOpen) return;
    isOpen = false;
    delete root.dataset.menu;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
    if (restoreFocus) toggle.focus();
  }

  toggle.addEventListener('click', () => (isOpen ? close() : open()));

  // Any link inside the overlay closes it — including Resume, which opens in a
  // new tab and would otherwise leave the overlay covering the page behind it.
  overlay.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => close({ restoreFocus: false }));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });

  // The toggle is hidden above 900px, so a menu left open across a resize to
  // desktop would strand `overflow: hidden` on the body with no way to undo it.
  const desktop = window.matchMedia('(min-width: 901px)');
  desktop.addEventListener('change', (event) => {
    if (event.matches) close({ restoreFocus: false });
  });
}

/* -------------------------------------------------------------------------
   Custom cursor
   ------------------------------------------------------------------------- */

function initCursor() {
  if (prefersReducedMotion || isCoarsePointer) return;

  const dot = document.querySelector('[data-cursor]');
  const follower = document.querySelector('[data-cursor-follower]');
  if (!dot || !follower) return;

  const root = document.documentElement;
  let pointerX = 0;
  let pointerY = 0;
  let followerX = 0;
  let followerY = 0;

  document.addEventListener('mousemove', (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    dot.style.left = `${pointerX}px`;
    dot.style.top = `${pointerY}px`;
  });

  // rAF loop instead of the original's setTimeout-per-mousemove, which queued a
  // timer on every pointer sample and drifted under load.
  function follow() {
    followerX += (pointerX - followerX) * 0.18;
    followerY += (pointerY - followerY) * 0.18;
    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;
    requestAnimationFrame(follow);
  }
  requestAnimationFrame(follow);

  // Delegated instead of listening on each control — covers content added later.
  const interactive = 'a, button, input, textarea, [role="button"]';
  document.addEventListener('mouseover', (event) => {
    if (event.target instanceof Element && event.target.closest(interactive)) {
      root.dataset.cursorState = 'active';
    }
  });
  document.addEventListener('mouseout', (event) => {
    if (event.target instanceof Element && event.target.closest(interactive)) {
      delete root.dataset.cursorState;
    }
  });
}

/* -------------------------------------------------------------------------
   Scroll reveal
   ------------------------------------------------------------------------- */

function initReveal() {
  const targets = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!targets.length) return;

  // Reduced motion is handled in CSS (reveals render visible); skip the
  // observer entirely rather than adding classes nothing depends on.
  if (prefersReducedMotion) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // reveal once, never re-hide
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach((target) => observer.observe(target));
}

/* -------------------------------------------------------------------------
   Header state
   ------------------------------------------------------------------------- */

function initHeader() {
  const root = document.documentElement;

  const sync = () => {
    if (window.scrollY > 12) {
      root.dataset.scrolled = 'true';
    } else {
      delete root.dataset.scrolled;
    }
  };

  // Passive listener + rAF throttle: the original recalculated layout on every
  // scroll event, including the offsets used by the section highlight.
  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        sync();
        ticking = false;
      });
    },
    { passive: true }
  );

  sync();
}

/* -------------------------------------------------------------------------
   Work rail — horizontal scroll
   ------------------------------------------------------------------------- */

function initRail() {
  const root = document.querySelector('[data-rail]');
  const track = root?.querySelector('[data-rail-track]');
  if (!root || !track) return;

  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const progress = document.querySelector('[data-rail-progress]');
  const fadeLeft = root.querySelector('.rail-fade.left');
  const fadeRight = root.querySelector('.rail-fade.right');

  const maxScroll = () => track.scrollWidth - track.clientWidth;

  /** One card plus the flex gap, so arrows land on a snap point. */
  function step() {
    const item = track.querySelector('.rail-item');
    if (!item) return track.clientWidth * 0.8;
    const gap = parseFloat(getComputedStyle(track).columnGap || '0') || 0;
    return item.getBoundingClientRect().width + gap;
  }

  function sync() {
    const max = maxScroll();
    const x = track.scrollLeft;
    const atStart = x <= 1;
    const atEnd = x >= max - 1;

    if (prev) prev.disabled = atStart;
    if (next) next.disabled = atEnd;

    fadeLeft?.toggleAttribute('data-hidden', atStart);
    fadeRight?.toggleAttribute('data-hidden', atEnd);

    if (progress) {
      // Width = visible fraction; left = how far through. Percentages of the
      // container, so no transform maths and no drift.
      const visible = track.clientWidth / track.scrollWidth;
      progress.style.width = `${visible * 100}%`;
      progress.style.left = max > 0 ? `${(x / track.scrollWidth) * 100}%` : '0%';
    }
  }

  prev?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  next?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));

  track.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync);
  sync();

  // --- drag to scroll ---------------------------------------------------
  // Desktop pointers only; touch already scrolls natively and hijacking it
  // would fight the browser's own momentum and snap behaviour.
  if (isCoarsePointer) return;

  let dragging = false;
  let startX = 0;
  let startScroll = 0;
  let moved = 0;

  track.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    dragging = true;
    moved = 0;
    startX = event.clientX;
    startScroll = track.scrollLeft;
    track.setAttribute('data-dragging', '');
  });

  track.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    const delta = event.clientX - startX;
    moved = Math.abs(delta);
    if (moved > 4) {
      track.scrollLeft = startScroll - delta;
      // Suppress the text selection that a drag would otherwise start.
      event.preventDefault();
    }
  });

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    track.removeAttribute('data-dragging');
  }

  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);
  track.addEventListener('pointerleave', endDrag);

  // A drag that happens to end over a card would otherwise navigate. Swallow
  // that one click, then clear the flag so the next click works normally.
  track.addEventListener(
    'click',
    (event) => {
      if (moved > 4) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    true
  );

  // Keyboard: the track is focusable, so arrow keys should scroll it.
  track.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      track.scrollBy({ left: step(), behavior: 'smooth' });
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      track.scrollBy({ left: -step(), behavior: 'smooth' });
    }
  });
}

/* ------------------------------------------------------------------------- */

function init() {
  initMenu();
  initCursor();
  initReveal();
  initHeader();
  initRail();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
