/* Sonet Club Uzbekistan: выноски на кузове, рубрики, галерея интерьера,
   тема, меню и чаты.

   Точки привязаны к деталям машины: ANCHORS хранит, где на студийном снимке
   капот, решётка, фара, лобовое, дверь, крыша, колесо, порог и корма.
   Рубрика лишь выбирает, какие детали показать. Если менять фотографию —
   координаты надо снимать заново по сетке в процентах, наложенной на снимок,
   и править соотношение сторон кадра в site.css. */
(function () {
  'use strict';

  /* Координаты деталей на img/car-white-*, в процентах от кадра.
     Раньше цветов было пять и у каждого был свой набор — переключатель
     цвета убрали, таблицы остальных лежат в истории (коммит 3d21241). */
  var ANCHORS = {
    hood:   [34, 41], grille: [29, 51], lamp: [43, 48],
    glass:  [45, 31], door:   [61, 35], roof: [57, 19],
    wheel:  [53, 65], sill:   [64, 61], rear: [69, 40]
  };

  /* Рубрики по порядку пилюль в разметке. Каждый плюс: деталь машины
     (ключ из ANCHORS) и подпись у выноски. Поле text сейчас нигде
     не показывается — карточку с подробностями справа убрали, — но тексты
     оставлены: их писали под эти же точки, и вернуть их дешевле, чем
     сочинять заново. */
  var CATS = [
    { name: 'Надёжность', pts: [
      { at: 'hood',  label: 'Атмосферник 1.5',
        text: 'Надёжный атмосферный 1.5: без турбины и прямого впрыска, то есть меньше узлов, которым есть что ломать. Неприхотлив к топливу и понятен любому сервису.' },
      { at: 'wheel', label: 'Компактная база',
        text: 'Короткая колёсная база и жёсткий кузов: машину меньше раскачивает на неровностях, со временем меньше поводов для сверчков в салоне.' },
      { at: 'sill',  label: 'Высокий клиренс',
        text: '205 мм под днищем, примерно как у Каптивы. Бордюры, лежачие полицейские и разбитый асфальт перестают требовать осторожной езды.' }
    ] },
    { name: 'Дизайн', pts: [
      { at: 'grille', label: 'Тигриный нос',
        text: 'Фирменная решётка Kia с объёмным сотовым рисунком и хромированной окантовкой — по ней машину узнают со спины впереди идущего.' },
      { at: 'lamp',   label: 'LED-оптика',
        text: 'Проекционные светодиодные фары с четырёхточечными ходовыми огнями, сзади — общая световая линия через всю дверь багажника.' },
      { at: 'wheel',  label: 'Диски R16',
        text: 'Легкосплавные, с двухцветной обработкой. Высокий профиль шины при этом остаётся — красота не в ущерб ямам.' }
    ] },
    { name: 'Безопасность', pts: [
      { at: 'door',  label: 'Шесть подушек',
        text: 'Фронтальные, боковые и шторки по всей длине салона — в базовой комплектации, а не за доплату.' },
      { at: 'wheel', label: 'ESC и старт в гору',
        text: 'Система стабилизации и удержание на подъёме: на светофоре в горку машина не откатывается назад.' },
      { at: 'rear',  label: 'Камера и датчики',
        text: 'Камера заднего вида с разметкой и датчики парковки — с такой посадкой это не роскошь, а необходимость.' }
    ] },
    { name: 'Комфорт', pts: [
      { at: 'glass', label: 'Мультимедиа',
        text: 'Современная система на большом экране, с Apple CarPlay и Android Auto: телефон подключается и дальше про него можно забыть.' },
      { at: 'door',  label: 'Климат и подогрев',
        text: 'Климат-контроль с физическими клавишами, подогрев передних сидений и руля. Крутить, не отрываясь от дороги, — можно.' },
      { at: 'roof',  label: 'Люк',
        text: 'Электролюк в старшей версии. Летом в Ташкенте спорно, зато весной и осенью — то, что нужно.' }
    ] },
    { name: 'Практичность', pts: [
      { at: 'glass', label: 'Механика или вариатор',
        text: 'Обе коробки экономичные: около 6,5 л на сотню в смешанном цикле. Вариатор тише и удобнее в пробке, механика дешевле в ремонте.' },
      { at: 'rear',  label: 'Багажник 385 л',
        text: 'До 1 050 литров со сложенным задним рядом — хватает и на переезд, и на поездку с багажом вчетвером.' },
      { at: 'roof',  label: 'Рейлинги',
        text: 'Штатные рейлинги под поперечины: бокс, велокрепление или груз сверх основного отсека.' }
    ] }
  ];

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ─── выноски: они есть только на главной ─────────────────────────── */
  var frame = $('#stageFrame');
  if (frame) {

  var spotsBox = $('#spots');
  var cat = 1;                        // Дизайн — как в макете
  var spot = 0;

  var LEAD = 6;                       // просвет между подписями и до края кадра

  function pts() { return CATS[cat].pts; }

  function layout() {
    var W = frame.clientWidth;
    var H = frame.clientHeight;
    if (!W || !H) return;

    var pins = $$('.pin', spotsBox);
    var calls = $$('.callout', spotsBox);

    /* Высоту подписи меряем, а не считаем: на узком кадре длинные названия
       переносятся на две строки, и фиксированный просвет их не разводит. */
    var items = pts().map(function (p, i) {
      var a = ANCHORS[p.at];
      return { i: i, x: a[0] / 100 * W, y: a[1] / 100 * H,
               left: a[0] < 50, h: calls[i].offsetHeight };
    });

    [true, false].forEach(function (isLeft) {
      var list = items.filter(function (t) { return t.left === isLeft; })
                      .sort(function (a, b) { return a.y - b.y; });
      if (!list.length) return;
      list.forEach(function (t) { t.ly = t.y; });
      /* раздвигаем сверху вниз, потом при нужде двигаем всю пачку в кадр */
      for (var k = 1; k < list.length; k++) {
        var need = (list[k - 1].h + list[k].h) / 2 + LEAD;
        if (list[k].ly - list[k - 1].ly < need) list[k].ly = list[k - 1].ly + need;
      }
      var last = list[list.length - 1];
      var over = last.ly + last.h / 2 - (H - LEAD);
      if (over > 0) list.forEach(function (t) { t.ly -= over; });
      var up = LEAD - (list[0].ly - list[0].h / 2);
      if (up > 0) list.forEach(function (t) { t.ly += up; });
    });

    items.forEach(function (t) {
      pins[t.i].style.left = t.x + 'px';
      pins[t.i].style.top = t.y + 'px';
      calls[t.i].classList.toggle('callout--left', t.left);
      calls[t.i].classList.toggle('callout--right', !t.left);
      calls[t.i].style.top = t.ly + 'px';
    });

    /* линии рисуем после того, как подписи встали: нужна их ширина */
    var svg = $('.leaders', spotsBox);
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    var paths = $$('.leader', svg);
    items.forEach(function (t) {
      var w = calls[t.i].offsetWidth;
      var ex = t.left ? w : W - w;          // внутренний край подписи
      paths[t.i].setAttribute('d', 'M' + ex + ' ' + t.ly + 'L' + t.x + ' ' + t.y);
    });
  }

  function renderCat() {
    var list = pts();
    spotsBox.innerHTML =
      '<svg class="leaders" aria-hidden="true" preserveAspectRatio="none">' +
      list.map(function () { return '<path class="leader"/>'; }).join('') +
      '</svg>' +
      list.map(function (p, i) {
        return '<button class="pin" type="button" data-spot="' + i +
               '" tabindex="-1" aria-hidden="true"><span></span></button>';
      }).join('') +
      list.map(function (p, i) {
        return '<button class="callout" type="button" data-spot="' + i +
               '" aria-pressed="false"></button>';
      }).join('');
    $$('.callout', spotsBox).forEach(function (el, i) { el.textContent = list[i].label; });

    layout();
    setSpot(0);
  }

  function setSpot(i) {
    spot = i;
    $$('.pin', spotsBox).forEach(function (b, n) { b.setAttribute('aria-pressed', String(n === i)); });
    $$('.callout', spotsBox).forEach(function (b, n) { b.setAttribute('aria-pressed', String(n === i)); });
    $$('.leader', spotsBox).forEach(function (l, n) { l.classList.toggle('is-on', n === i); });
  }

  function setCat(i) {
    cat = i;
    $$('.cats .pill').forEach(function (b) {
      b.setAttribute('aria-pressed', String(+b.dataset.cat === i));
    });
    renderCat();
  }

  /* ─── галерея интерьера ───────────────────────────────────────────── */
  function setGal(i) {
    $$('.gal').forEach(function (g) { g.classList.toggle('is-on', +g.dataset.gal === i); });
    $$('.thumb').forEach(function (b) {
      b.setAttribute('aria-pressed', String(+b.dataset.thumb === i));
      b.classList.toggle('is-on', +b.dataset.thumb === i);
    });
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-spot], [data-cat], [data-thumb]');
    if (!t) return;
    if (t.dataset.spot !== undefined) setSpot(+t.dataset.spot);
    else if (t.dataset.cat !== undefined) setCat(+t.dataset.cat);
    else if (t.dataset.thumb !== undefined) setGal(+t.dataset.thumb);
  });

  renderCat();

  /* Кадр меняет ширину вместе с окном — пересчитываем раскладку подписей. */
  if ('ResizeObserver' in window) new ResizeObserver(layout).observe(frame);
  else window.addEventListener('resize', layout);

  }   /* конец конфигуратора */

  /* ─── тема ────────────────────────────────────────────────────────── */
  var themeBtn = $('#theme');
  function currentTheme() {
    var set = document.documentElement.dataset.theme;
    if (set) return set;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function syncThemeLabel() {
    var dark = currentTheme() === 'dark';
    themeBtn.setAttribute('aria-label', dark ? 'Светлая тема' : 'Тёмная тема');
    themeBtn.setAttribute('aria-pressed', String(dark));
  }
  themeBtn.addEventListener('click', function () {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('sonet-theme', next); } catch (err) {}
    syncThemeLabel();
  });
  syncThemeLabel();

  /* ─── мобильное меню ──────────────────────────────────────────────── */
  var burger = $('#burger');
  var nav = $('#nav');
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) {
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  /* ─── чаты в Telegram ─────────────────────────────────────────────── */
  /* Адреса групп лежат в config.js. Пока список пуст — блока нет вовсе:
     ссылка в никуда хуже, чем её отсутствие. */
  var chats = (window.SONET && window.SONET.chats) || [];
  if (chats.length) {
    /* чаты — в том же ряду, что и разделы сайта: отдельной полосой они
       читались как чужой элемент над шапкой */
    var sep = $('#navChats');
    var TG = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="1.9" stroke-linecap="round" ' +
      'stroke-linejoin="round" aria-hidden="true">' +
      '<path d="m21 4-3 16-6-4-3 4-1-6 13-10Z"/><path d="m8 14 13-10"/></svg>';
    sep.insertAdjacentHTML('afterend', chats.map(function () {
      return '<a class="pill pill--chat" target="_blank" rel="noopener">' + TG +
             '<span></span></a>';
    }).join(''));
    $$('.pill--chat').forEach(function (a, i) {
      a.href = chats[i].url;
      a.querySelector('span').textContent = chats[i].note || chats[i].name;
    });
    sep.hidden = false;

    var box = $('#chatsLinks');
    box.innerHTML = chats.map(function () {
      return '<a class="chat" target="_blank" rel="noopener">' +
             '<span class="chat__name"></span>' +
             '<span class="chat__note"></span>' +
             '<span class="dot-btn" aria-hidden="true">' +
             '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
             'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
             '<path d="m21 4-3 16-6-4-3 4-1-6 13-10Z"/><path d="m8 14 13-10"/></svg></span></a>';
    }).join('');
    $$('.chat', box).forEach(function (a, i) {
      a.href = chats[i].url;
      $('.chat__name', a).textContent = chats[i].name;
      $('.chat__note', a).textContent = chats[i].note || '';
    });
    $('#chats').hidden = false;
  }
})();
