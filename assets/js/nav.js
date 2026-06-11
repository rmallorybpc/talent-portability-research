/* TMG nav dropdown — shared across all pages */
(function () {
  'use strict';
  const btn  = document.getElementById('tmgDdBtn');
  const menu = document.getElementById('tmgDdMenu');
  const items = Array.from(menu ? menu.querySelectorAll('[role="menuitem"]') : []);
  if (!btn || !menu) return;

  function setActiveItem(index) {
    items.forEach(function (item, i) {
      item.tabIndex = i === index ? 0 : -1;
    });
  }

  function openMenu(focusIndex) {
    menu.classList.add('open');
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    if (!items.length || typeof focusIndex !== 'number') return;
    setActiveItem(focusIndex);
    items[focusIndex].focus();
  }

  function closeMenu(focusButton) {
    menu.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    if (focusButton) btn.focus();
  }

  btn.addEventListener('click', function () {
    if (menu.classList.contains('open')) {
      closeMenu(false);
      return;
    }
    openMenu();
  });

  btn.addEventListener('keydown', function (e) {
    if (!items.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      openMenu(0);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      openMenu(items.length - 1);
    }
  });

  document.addEventListener('click', function (e) {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      closeMenu(false);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (!menu.classList.contains('open')) return;
    if (e.key === 'Escape') {
      closeMenu(true);
      return;
    }
    if (!items.length) return;
    const index = items.indexOf(document.activeElement);
    if (index < 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveItem((index + 1) % items.length);
      items[(index + 1) % items.length].focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveItem((index - 1 + items.length) % items.length);
      items[(index - 1 + items.length) % items.length].focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveItem(0);
      items[0].focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveItem(items.length - 1);
      items[items.length - 1].focus();
    } else if (e.key === 'Tab') {
      closeMenu(false);
    }
  });
}());
