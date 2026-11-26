// Año automático en el footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Menú móvil
const nav = document.querySelector('.nav');
const toggle = document.getElementById('navToggle');

toggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('nav--open');
  toggle.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('.nav__links a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('nav--open');
    toggle.setAttribute('aria-expanded', 'false');
  });
});

// Filtros de proyectos: muestra solo las tarjetas de la categoría elegida
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('#projectsGrid .pin-card');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;

    filterButtons.forEach(b => b.classList.toggle('active', b === button));

    projectCards.forEach(card => {
      const categories = (card.dataset.cat || '').split(' ');
      // Las tarjetas con data-solo (por ejemplo "freelance") no salen en "Todos":
      // solo aparecen cuando se elige ese filtro.
      const visible = filter === 'all'
        ? !card.hasAttribute('data-solo')
        : categories.includes(filter);
      card.classList.toggle('is-hidden', !visible);
    });

    // Los mini carruseles miden su ancho al moverse; al mostrar tarjetas
    // de nuevo les avisamos para que recalculen.
    window.dispatchEvent(new Event('resize'));
  });
});

// Mini carruseles dentro de tarjetas
document.querySelectorAll('.mini-carousel').forEach(carousel => {
  const miniTrack = carousel.querySelector('.mini-track');
  const items = miniTrack.querySelectorAll('img, video');
  const miniPrev = carousel.querySelector('.mini-prev');
  const miniNext = carousel.querySelector('.mini-next');
  const miniCaption = carousel.querySelector('.mini-caption');
  let idx = 0;

  function goToMini(i) {
    idx = Math.max(0, Math.min(i, items.length - 1));
    const itemWidth = items[0].getBoundingClientRect().width;
    miniTrack.style.transform = `translateX(-${idx * itemWidth}px)`;

    miniPrev.disabled = idx === 0;
    miniNext.disabled = idx === items.length - 1;

    // Pie de foto: muestra el texto data-caption de la imagen actual
    if (miniCaption) miniCaption.textContent = items[idx].dataset.caption || '';
  }

  miniPrev.addEventListener('click', e => {
    e.stopPropagation();
    goToMini(idx - 1);
  });
  miniNext.addEventListener('click', e => {
    e.stopPropagation();
    goToMini(idx + 1);
  });

  let startX = 0;
  carousel.addEventListener('touchstart', e => startX = e.touches[0].clientX);
  carousel.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (diff > 40) goToMini(idx + 1);
    if (diff < -40) goToMini(idx - 1);
  });

  // Recalcula el ancho del slide si la ventana cambia de tamaño
  window.addEventListener('resize', () => goToMini(idx));

  // Estado inicial de las flechas
  goToMini(0);
});

// Parallax de las burbujas — se mueven a distinta velocidad que el scroll,
// dando sensación de profundidad, como si flotaran en el espacio.
const bubbles = document.querySelectorAll('.bubble');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (bubbles.length && !reduceMotion) {
  let ticking = false;

  function updateBubbleParallax() {
    const scrollY = window.scrollY;
    bubbles.forEach(bubble => {
      const speed = parseFloat(bubble.dataset.speed || '0.15');
      bubble.style.setProperty('--ty', `${scrollY * speed}px`);
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateBubbleParallax);
      ticking = true;
    }
  }, { passive: true });

  updateBubbleParallax();
}