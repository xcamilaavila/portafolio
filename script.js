// Año automático en el footer
document.getElementById('year').textContent = new Date().getFullYear();

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
const cards = Array.from(carouselTrack.children);
const btnPrev = document.querySelector('.carousel__btn--prev');
const btnNext = document.querySelector('.carousel__btn--next');
const dotsContainer = document.getElementById('carouselDots');

let current = 0;
const visible = () => window.innerWidth <= 860 ? 1 : 3;

cards.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.classList.add('carousel__dot');
  dot.setAttribute('aria-label', `Proyecto ${i + 1}`);
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToMain(i));
  dotsContainer.appendChild(dot);
});

function goToMain(index) {
  const v = visible();
  const max = cards.length - v;
  current = Math.max(0, Math.min(index, max));
  const cardWidth = cards[0].offsetWidth + 24;
  carouselTrack.style.transform = `translateX(-${current * cardWidth}px)`;
  document.querySelectorAll('.carousel__dot').forEach((d, i) => {
    d.classList.toggle('active', i === current);
  });
  btnPrev.disabled = current === 0;
  btnNext.disabled = current >= max;
}

btnPrev.addEventListener('click', () => goToMain(current - 1));
btnNext.addEventListener('click', () => goToMain(current + 1));
window.addEventListener('resize', () => goToMain(current));
goToMain(0);

// Mini carruseles dentro de tarjetas
document.querySelectorAll('.mini-carousel').forEach(carousel => {
  const miniTrack = carousel.querySelector('.mini-track');
  const items = miniTrack.querySelectorAll('img, video');
  let idx = 0;

  function goToMini(i) {
    idx = Math.max(0, Math.min(i, items.length - 1));
    miniTrack.style.transform = `translateX(-${idx * 100}%)`;
  }

  carousel.querySelector('.mini-prev').addEventListener('click', e => {
    e.stopPropagation();
    goToMini(idx - 1);
  });
  carousel.querySelector('.mini-next').addEventListener('click', e => {
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
});