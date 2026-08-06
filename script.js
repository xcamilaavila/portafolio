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

// Carrusel principal
const carouselTrack = document.querySelector('.carousel__track');
const carouselContainer = document.querySelector('.carousel__track-container');
const cards = Array.from(carouselTrack.children);
const btnPrev = document.querySelector('.carousel__btn--prev');
const btnNext = document.querySelector('.carousel__btn--next');
const dotsContainer = document.getElementById('carouselDots');

let current = 0;
let translateX = 0; // guardamos el desplazamiento acumulado real

cards.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.classList.add('carousel__dot');
  dot.setAttribute('aria-label', `Proyecto ${i + 1}`);
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToMain(i));
  dotsContainer.appendChild(dot);
});

function goToMain(index) {
  const max = cards.length - 1;
  current = Math.max(0, Math.min(index, max));

  // Medimos EN PANTALLA, ahora mismo, dónde está el borde izquierdo del
  // contenedor visible y dónde está el borde izquierdo de la tarjeta a
  // la que queremos ir. Nos movemos exactamente esa diferencia. Como es
  // una medición real (no una fórmula con ancho/gap asumidos), no importa
  // si alguna tarjeta mide distinto: siempre queda perfectamente alineada.
  const containerRect = carouselContainer.getBoundingClientRect();
  const cardRect = cards[current].getBoundingClientRect();
  translateX += (containerRect.left - cardRect.left);

  carouselTrack.style.transform = `translateX(${translateX}px)`;

  document.querySelectorAll('.carousel__dot').forEach((d, i) => {
    d.classList.toggle('active', i === current);
  });

  btnPrev.disabled = current === 0;
  btnNext.disabled = current >= max;
}

btnPrev.addEventListener('click', () => goToMain(current - 1));
btnNext.addEventListener('click', () => goToMain(current + 1));
window.addEventListener('resize', () => {
  translateX = 0;
  carouselTrack.style.transform = 'translateX(0px)';
  goToMain(current);
});
goToMain(0);

// Mini carruseles dentro de tarjetas
document.querySelectorAll('.mini-carousel').forEach(carousel => {
  const miniTrack = carousel.querySelector('.mini-track');
  const items = miniTrack.querySelectorAll('img, video');
  const miniPrev = carousel.querySelector('.mini-prev');
  const miniNext = carousel.querySelector('.mini-next');
  let idx = 0;

  function goToMini(i) {
    idx = Math.max(0, Math.min(i, items.length - 1));
    const itemWidth = items[0].getBoundingClientRect().width;
    miniTrack.style.transform = `translateX(-${idx * itemWidth}px)`;

    miniPrev.disabled = idx === 0;
    miniNext.disabled = idx === items.length - 1;
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