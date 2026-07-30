/* ==========================================================================
   Campaign Slider
   ========================================================================== */
(function () {
  const wrap    = document.querySelector('.campaign__slider-outer');
  const slider  = document.querySelector('.campaign__slider');
  if (!slider) return;

  const GAP      = 24;
  const INTERVAL = 5000;
  const origItems = Array.from(slider.querySelectorAll('.campaign__item'));
  const total     = origItems.length;
  let   current   = total; // orig先頭のインデックス
  let   timer     = null;
  let   isMoving  = false;
  let   stepPx    = 0;    // アイテム幅 + gap(初期化時に計算)

  // 前後にクローンを追加
  // 並び: [clone 1234: 0-3] [orig 1234: 4-7] [clone 1234: 8-11]
  [...origItems].reverse().forEach(el => slider.prepend(el.cloneNode(true)));
  [...origItems].forEach(el => slider.append(el.cloneNode(true)));

  function calcStep() {
    stepPx = slider.querySelector('.campaign__item').getBoundingClientRect().width + GAP;
  }

  function jumpTo(index) {
    slider.style.transition = 'none';
    slider.style.transform  = `translateX(-${index * stepPx}px)`;
    slider.getBoundingClientRect(); // 強制リフロー
  }

  function slideTo(index) {
    if (isMoving) return;
    isMoving = true;
    current  = index;
    slider.style.transition = 'transform 0.5s ease';
    slider.style.transform  = `translateX(-${current * stepPx}px)`;
  }

  // アニメ終了後、クローン領域に入っていたらorig位置へ瞬間移動
  slider.addEventListener('transitionend', () => {
    if (current < total)      { current += total; jumpTo(current); }
    if (current >= total * 2) { current -= total; jumpTo(current); }
    isMoving = false;
  });

  const next = () => slideTo(current + 1);
  const prev = () => slideTo(current - 1);

  const startTimer = () => { timer = setInterval(next, INTERVAL); };
  const stopTimer  = () => { clearInterval(timer); };

  // リサイズ時にstepPxを再計算して位置を補正
  window.addEventListener('resize', () => {
    calcStep();
    jumpTo(current);
  });

  // 初期化
  calcStep();
  jumpTo(current);
  startTimer();

  // ボタン操作(クリック後タイマーリセット)
  document.querySelector('.campaign__btn--next').addEventListener('click', () => { stopTimer(); next(); startTimer(); });
  document.querySelector('.campaign__btn--prev').addEventListener('click', () => { stopTimer(); prev(); startTimer(); });

  // マウスオーバー中は停止
  wrap.addEventListener('mouseenter', stopTimer);
  wrap.addEventListener('mouseleave', startTimer);
})();


/* ==========================================================================
   FAQ Accordion
   ========================================================================== */
(function () {
  const questions = document.querySelectorAll('.faq__question');
  if (!questions.length) return;

  questions.forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen   = btn.getAttribute('aria-expanded') === 'true';
      const answer   = btn.nextElementSibling;

      // 他を閉じる
      questions.forEach(other => {
        other.setAttribute('aria-expanded', 'false');
        other.nextElementSibling.hidden = true;
      });

      // クリックしたものをトグル
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.hidden = false;
      }
    });
  });
})();


/* ==========================================================================
   Hamburger Menu
   ========================================================================== */
(function () {
  const hamburger = document.querySelector('.l-header__hamburger');
  const nav       = document.querySelector('.l-header__nav');
  const overlay   = document.querySelector('.l-header__overlay');
  const header    = document.querySelector('.l-header');
  if (!hamburger) return;

  function openMenu() {
    hamburger.classList.add('is-open');
    nav.classList.add('is-open');
    overlay.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    hamburger.classList.remove('is-open');
    nav.classList.remove('is-open');
    overlay.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('is-open') ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  const closeBtn = document.querySelector('.l-header__close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  // ナビのリンクをクリックしたらメニューを閉じる
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // l-headerをrelativeに（ドロワーのposition: absoluteの基準）
  header.style.position = 'sticky';
})();