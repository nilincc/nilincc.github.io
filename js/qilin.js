/*!
 * nilin — interactions
 * 无依赖，约 8KB
 */
(function () {
  'use strict';

  const doc = document;
  const body = doc.body;
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- sticky header ---------- */
  const header = doc.getElementById('site-header');
  const onScrollHeader = function () {
    if (!header) return;
    header.classList.toggle('is-stuck', window.scrollY > 8);
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------- mobile navigation ---------- */
  const navToggle = doc.getElementById('nav-toggle');
  const mobileNav = doc.getElementById('mobile-nav');

  const setNav = function (open) {
    body.classList.toggle('nav-open', open);
    if (navToggle) navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (mobileNav) mobileNav.setAttribute('aria-hidden', open ? 'false' : 'true');
  };

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      setNav(!body.classList.contains('nav-open'));
    });
  }

  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setNav(false); });
    });

    mobileNav.querySelectorAll('.mobile-sub-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const item = btn.closest('.mobile-nav__item');
        const open = !item.classList.contains('is-open');
        item.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });
  }

  doc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && body.classList.contains('nav-open')) setNav(false);
  });

  /* ---------- portfolio filter + load more ---------- */
  doc.querySelectorAll('.js-pf').forEach(function (block) {
    const grid = block.querySelector('.js-pf-grid');
    if (!grid) return;

    const cards = Array.prototype.slice.call(grid.querySelectorAll('.pf-card'));
    const buttons = Array.prototype.slice.call(block.querySelectorAll('.js-pf-filter button'));
    const more = block.querySelector('.js-pf-more');
    const empty = block.querySelector('.js-pf-empty');
    const counter = block.querySelector('.js-pf-count');
    const initial = parseInt(block.getAttribute('data-initial'), 10) || cards.length;

    let filter = '*';
    let expanded = false;

    const matches = function (card) {
      if (filter === '*') return true;
      const cats = (card.getAttribute('data-cats') || '').split('|');
      return cats.indexOf(filter) > -1;
    };

    const render = function () {
      const pool = cards.filter(matches);
      const limit = expanded ? pool.length : initial;
      let shown = 0;

      cards.forEach(function (card) {
        const visible = pool.indexOf(card) > -1 && pool.indexOf(card) < limit;
        card.classList.toggle('is-hidden', !visible);
        if (visible) shown += 1;
      });

      if (empty) empty.hidden = pool.length !== 0;
      if (counter) counter.textContent = shown + ' / ' + pool.length;
      if (more) more.parentNode.classList.toggle('is-hidden', shown >= pool.length);
    };

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        filter = btn.getAttribute('data-filter') || '*';
        expanded = false;
        render();
      });
    });

    if (more) {
      more.addEventListener('click', function () {
        expanded = true;
        render();
      });
    }

    render();
  });

  /* ---------- lightbox ---------- */
  const lightbox = doc.getElementById('lightbox');
  if (lightbox) {
    const img = lightbox.querySelector('.lightbox__img');
    const caption = lightbox.querySelector('.lightbox__caption');
    const closeBtn = lightbox.querySelector('.lightbox__close');
    let lastFocus = null;

    const open = function (src, text, trigger) {
      if (!src) return;
      lastFocus = trigger || null;
      img.setAttribute('src', src);
      caption.textContent = text || '';
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      body.classList.add('is-locked');
    };

    const close = function () {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      body.classList.remove('is-locked');
      setTimeout(function () {
        if (!lightbox.classList.contains('is-open')) img.setAttribute('src', '');
      }, 400);
      if (lastFocus) lastFocus.focus();
    };

    doc.addEventListener('click', function (e) {
      const trigger = e.target.closest('.js-lightbox');
      if (!trigger) return;
      e.preventDefault();
      open(trigger.getAttribute('data-src'), trigger.getAttribute('data-caption'), trigger);
    });

    if (closeBtn) closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) close();
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) close();
    });
  }

  /* ---------- copy link ---------- */
  doc.querySelectorAll('.js-copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const url = btn.getAttribute('data-url') || window.location.href;
      const original = btn.textContent;
      const done = function () {
        btn.textContent = (doc.documentElement.lang || '').indexOf('zh') === 0 ? '已复制' : 'Copied';
        setTimeout(function () { btn.textContent = original; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done).catch(function () { fallback(url, done); });
      } else {
        fallback(url, done);
      }
    });
  });

  function fallback(text, done) {
    const ta = doc.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    doc.body.appendChild(ta);
    ta.select();
    try { doc.execCommand('copy'); done(); } catch (e) { /* noop */ }
    doc.body.removeChild(ta);
  }

  /* ---------- reveal on scroll ---------- */
  const revealItems = Array.prototype.slice.call(doc.querySelectorAll('.reveal'));
  if (revealItems.length) {
    if (prefersReduced || !('IntersectionObserver' in window)) {
      revealItems.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
      revealItems.forEach(function (el) { revealObserver.observe(el); });
    }
  }

  /* ---------- back to top ---------- */
  const toTop = doc.getElementById('to-top');
  if (toTop) {
    const onScrollTop = function () {
      toTop.classList.toggle('is-visible', window.scrollY > 600);
    };
    onScrollTop();
    window.addEventListener('scroll', onScrollTop, { passive: true });
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  }

  /* ---------- table of contents ---------- */
  const content = doc.getElementById('post-content');
  const toc = doc.getElementById('toc');
  const tocWidget = doc.getElementById('toc-widget');

  if (content && toc && tocWidget) {
    const headings = Array.prototype.slice.call(content.querySelectorAll('h2, h3'));
    if (headings.length >= 2) {
      tocWidget.classList.remove('is-hidden');
      const list = doc.createElement('ul');

      headings.forEach(function (heading, index) {
        if (!heading.id) heading.id = 'section-' + (index + 1) + '-' + Math.random().toString(36).slice(2, 6);
        const li = doc.createElement('li');
        const a = doc.createElement('a');
        a.href = '#' + heading.id;
        a.textContent = heading.textContent;
        a.className = 'toc__link' + (heading.tagName === 'H3' ? ' toc__link--sub' : '');
        li.appendChild(a);
        list.appendChild(li);
      });

      toc.appendChild(list);

      const links = Array.prototype.slice.call(toc.querySelectorAll('a'));
      if ('IntersectionObserver' in window) {
        const spy = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            links.forEach(function (link) {
              link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
            });
          });
        }, { rootMargin: '-12% 0px -72% 0px', threshold: 0 });
        headings.forEach(function (heading) { spy.observe(heading); });
      }
    }
  }

  /* ---------- external links ---------- */
  doc.querySelectorAll('.prose a[href^="http"]').forEach(function (link) {
    if (link.hostname && link.hostname !== window.location.hostname) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });

  /* ---------- year ---------- */
  const yearEl = doc.querySelector('[data-current-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
