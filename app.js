/* Sonet Club Uzbekistan: конфигуратор цвета, точки на кузове, рубрики
   «За что мы любим Sonet?», галерея интерьера, тема и меню.

   Точки привязаны не к рубрике, а к деталям машины: в COLORS[].at лежит,
   где на каждой фотографии капот, решётка, фара, салон и так далее. Снимки
   сделаны с разных ракурсов (у серебристого машина вообще развёрнута
   в другую сторону), поэтому координаты у каждого цвета свои. Рубрика
   лишь выбирает, какие детали показать и что про них написать. */
(function () {
  'use strict';

  var COLORS = [
    { file: 'car-white',  ext: 'png', widths: [740, 1480], ar: '16 / 9',
      name: 'Glacier White Pearl',
      alt: 'Kia Sonet в цвете Glacier White Pearl, студийная съёмка',
      at: { hood: [34, 41], grille: [29, 51], lamp: [43, 48], glass: [45, 31],
            door: [61, 35], roof: [57, 19], wheel: [53, 65], sill: [64, 61],
            rear: [69, 40] } },
    { file: 'car-red',    ext: 'jpg', widths: [740, 1480], ar: '16 / 9',
      name: 'Intense Red',
      alt: 'Kia Sonet в цвете Intense Red на трассе',
      at: { hood: [43, 46], grille: [38, 56], lamp: [51, 53], glass: [49, 35],
            door: [63, 40], roof: [56, 28], wheel: [62, 68], sill: [70, 63],
            rear: [74, 47] } },
    { file: 'car-black',  ext: 'jpg', widths: [740, 1480], ar: '16 / 9',
      name: 'Aurora Black Pearl',
      alt: 'Kia Sonet в цвете Aurora Black Pearl у стены с граффити',
      at: { hood: [40, 50], grille: [35, 58], lamp: [48, 56], glass: [48, 41],
            door: [63, 46], roof: [55, 33], wheel: [55, 73], sill: [67, 68],
            rear: [77, 50] } },
    { file: 'car-grey',   ext: 'jpg', widths: [740, 1480], ar: '3 / 2',
      name: 'Steel Grey',
      alt: 'Kia Sonet в цвете Steel Grey в автосалоне',
      at: { hood: [37, 35], grille: [31, 45], lamp: [46, 44], glass: [46, 26],
            door: [63, 31], roof: [56, 17], wheel: [55, 63], sill: [67, 57],
            rear: [77, 38] } },
    { file: 'car-silver', ext: 'jpg', widths: [740, 1200], ar: '3 / 2',
      name: 'Sparkling Silver',
      alt: 'Kia Sonet в цвете Sparkling Silver у современного здания',
      /* машина развёрнута носом вправо — передние детали справа, корма слева */
      at: { hood: [52, 46], grille: [69, 55], lamp: [58, 52], glass: [47, 40],
            door: [34, 45], roof: [40, 35], wheel: [45, 68], sill: [34, 65],
            rear: [23, 50] } }
  ];

  /* Рубрики «За что мы любим Sonet?» — по порядку пилюль в разметке.
     Каждый плюс: деталь машины (ключ из COLORS.at), подпись у точки
     и текст в карточке справа. */
  var CATS = [
    { name: 'Динамика', pts: [
      { at: 'hood',  label: 'Мотор 1.5',   text: '115 л.с. и 144 Н·м. Разгон до 100 км/ч примерно за 12,5 с — для города с запасом, на трассу выходить спокойно.' },
      { at: 'glass', label: 'Коробка',     text: 'Механика на шесть ступеней или вариатор IVT. Вариатор тише и удобнее в пробке, механика дешевле в ремонте.' },
      { at: 'wheel', label: 'Расход',      text: 'Около 6,5 л на сотню в смешанном цикле. По городу с кондиционером — заметно больше, это честно.' }
    ] },
    { name: 'Дизайн', pts: [
      { at: 'grille', label: 'Тигриный нос', text: 'Фирменная решётка Kia с объёмным сотовым рисунком и хромированной окантовкой — по ней машину узнают со спины впереди идущего.' },
      { at: 'lamp',   label: 'LED-оптика',   text: 'Проекционные светодиодные фары с четырёхточечными ходовыми огнями, сзади — общая световая линия через всю дверь багажника.' },
      { at: 'wheel',  label: 'Диски R16',    text: 'Легкосплавные, с двухцветной обработкой. Высокий профиль шины при этом остаётся — красота не в ущерб ямам.' }
    ] },
    { name: 'Безопасность', pts: [
      { at: 'door',  label: 'Шесть подушек', text: 'Фронтальные, боковые и шторки по всей длине салона — в базовой комплектации, а не за доплату.' },
      { at: 'wheel', label: 'ESC и старт в гору', text: 'Система стабилизации и удержание на подъёме: на светофоре в горку машина не откатывается назад.' },
      { at: 'rear',  label: 'Камера и датчики', text: 'Камера заднего вида с разметкой и датчики парковки — с такой посадкой это не роскошь, а необходимость.' }
    ] },
    { name: 'Комфорт', pts: [
      { at: 'glass', label: 'Мультимедиа',  text: 'Экран с Apple CarPlay и Android Auto: телефон подключается и дальше про него можно забыть.' },
      { at: 'door',  label: 'Климат и подогрев', text: 'Климат-контроль с физическими клавишами, подогрев передних сидений и руля. Крутить, не отрываясь от дороги, — можно.' },
      { at: 'roof',  label: 'Люк',          text: 'Электролюк в старшей версии. Летом в Ташкенте спорно, зато весной и осенью — то, что нужно.' }
    ] },
    { name: 'Практичность', pts: [
      { at: 'hood',  label: 'Ресурсный мотор', text: 'Атмосферный 1.5 без турбины и прямого впрыска: неприхотлив к топливу, дешевле в обслуживании и понятен любому сервису.' },
      { at: 'sill',  label: 'Клиренс 205 мм',  text: 'Примерно как у Каптивы — если её посадка вам знакома, то и тут так же. Бордюры, лежачие полицейские и разбитый асфальт перестают требовать осторожной езды.' },
      { at: 'rear',  label: 'Багажник 385 л',  text: 'До 1 050 литров со сложенным задним рядом — хватает и на переезд, и на поездку с багажом вчетвером.' },
      { at: 'roof',  label: 'Рейлинги',        text: 'Штатные рейлинги под поперечины: бокс, велокрепление или груз сверх основного отсека.' }
    ] }
  ];

  /* Должно совпадать с sizes у стартовой картинки в index.html */
  var SIZES = '(max-width: 859px) 92vw, (max-width: 1119px) 70vw, 740px';

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ─── конфигуратор: он есть только на главной ─────────────────────── */
  var frame = $('#stageFrame');
  if (frame) {

  /* ─── цвет кузова ─────────────────────────────────────────────────── */
  var pics = [$('#picA'), $('#picB')];
  var live = 0;                       // индекс видимой картинки
  var color = 0;                      // Glacier White Pearl — как в макете
  var preloaded = false;

  function srcset(c, ext) {
    return c.widths.map(function (w) {
      return 'img/' + c.file + '-' + w + '.' + ext + ' ' + w + 'w';
    }).join(', ');
  }

  function fill(pic, c) {
    var source = pic.querySelector('source');
    var img = pic.querySelector('img');
    source.type = 'image/webp';
    source.srcset = srcset(c, 'webp');
    source.sizes = SIZES;
    img.sizes = SIZES;
    img.srcset = srcset(c, c.ext);
    img.src = 'img/' + c.file + '-' + c.widths[0] + '.' + c.ext;
    img.alt = c.alt;
    return img;
  }

  /* Для предзагрузки формат надо выбрать самим: в одном srcset webp и jpg
     смешивать нельзя — браузер не знает, какой из них умеет открыть. */
  var WEBP = (function () {
    try {
      return document.createElement('canvas')
        .toDataURL('image/webp').indexOf('data:image/webp') === 0;
    } catch (err) { return false; }
  })();

  function preloadColors() {
    if (preloaded) return;
    preloaded = true;
    COLORS.forEach(function (c, i) {
      if (i === color) return;
      var ext = WEBP ? 'webp' : c.ext;
      var im = new Image();
      im.sizes = SIZES;
      im.srcset = srcset(c, ext);
      im.src = 'img/' + c.file + '-' + c.widths[0] + '.' + ext;
    });
  }

  function setColor(i, quiet) {
    i = (i + COLORS.length) % COLORS.length;
    if (i === color && quiet) return;
    color = i;
    var c = COLORS[i];

    $$('.sw').forEach(function (b) {
      b.setAttribute('aria-checked', String(+b.dataset.color === i));
    });
    layout();

    var next = pics[1 - live];
    var img = fill(next, c);

    var show = function () {
      frame.style.aspectRatio = c.ar;
      next.classList.add('is-on');
      next.removeAttribute('aria-hidden');
      pics[live].classList.remove('is-on');
      pics[live].setAttribute('aria-hidden', 'true');
      pics[live].querySelector('img').alt = '';
      live = 1 - live;
    };

    if (img.complete) show();
    else {
      img.addEventListener('load', show, { once: true });
      img.addEventListener('error', show, { once: true });
    }
  }

  /* ─── точки на кузове и список плюсов ─────────────────────────────── */
  /* Подписи не лепим вплотную к точкам: на некоторых ракурсах детали стоят
     рядом, и пилюли налезали друг на друга. Вместо этого — выноски:
     точка на детали, подпись у края кадра, между ними линия. Подписи
     раскладываются по вертикали так, чтобы не пересекаться. */
  var spotsBox = $('#spots');
  var catList = $('#catList');
  var cat = 1;                        // Дизайн — как в макете
  var spot = 0;

  var GAP = 38;                       // минимальный просвет между подписями
  var EDGE = 6;                       // отступ от верха и низа кадра

  function pts() { return CATS[cat].pts; }

  function layout() {
    var W = frame.clientWidth;
    var H = frame.clientHeight;
    if (!W || !H) return;

    var at = COLORS[color].at;
    var items = pts().map(function (p, i) {
      var a = at[p.at];
      return { i: i, x: a[0] / 100 * W, y: a[1] / 100 * H, left: a[0] < 50 };
    });

    [true, false].forEach(function (isLeft) {
      var list = items.filter(function (t) { return t.left === isLeft; })
                      .sort(function (a, b) { return a.y - b.y; });
      list.forEach(function (t) { t.ly = t.y; });
      /* раздвигаем сверху вниз, потом при нужде поднимаем всю пачку */
      for (var k = 1; k < list.length; k++) {
        if (list[k].ly - list[k - 1].ly < GAP) list[k].ly = list[k - 1].ly + GAP;
      }
      if (list.length) {
        var over = list[list.length - 1].ly - (H - EDGE);
        if (over > 0) list.forEach(function (t) { t.ly -= over; });
        if (list[0].ly < EDGE) {
          var up = EDGE - list[0].ly;
          list.forEach(function (t) { t.ly += up; });
        }
      }
    });

    var pins = $$('.pin', spotsBox);
    var calls = $$('.callout', spotsBox);
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

    catList.innerHTML = list.map(function (p, i) {
      return '<li><button class="loves__item" type="button" data-spot="' + i +
             '" aria-pressed="false"></button></li>';
    }).join('');
    $$('.loves__item', catList).forEach(function (el, i) { el.textContent = list[i].label; });

    layout();
    setSpot(0);
  }

  function setSpot(i) {
    spot = i;
    var p = pts()[i];
    $$('.pin', spotsBox).forEach(function (b, n) { b.setAttribute('aria-pressed', String(n === i)); });
    $$('.callout', spotsBox).forEach(function (b, n) { b.setAttribute('aria-pressed', String(n === i)); });
    $$('.leader', spotsBox).forEach(function (l, n) { l.classList.toggle('is-on', n === i); });
    $$('.loves__item', catList).forEach(function (b, n) { b.setAttribute('aria-pressed', String(n === i)); });
    $('#spotKicker').textContent = CATS[cat].name;
    $('#spotTitle').textContent = p.label;
    $('#spotText').textContent = p.text;
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

  /* ─── события конфигуратора ───────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-color], [data-spot], [data-cat], [data-thumb]');
    if (!t) return;
    if (t.dataset.color !== undefined) { preloadColors(); setColor(+t.dataset.color, true); }
    else if (t.dataset.spot !== undefined) setSpot(+t.dataset.spot);
    else if (t.dataset.cat !== undefined) setCat(+t.dataset.cat);
    else if (t.dataset.thumb !== undefined) setGal(+t.dataset.thumb);
  });

  $('#prevColor').addEventListener('click', function () { preloadColors(); setColor(color - 1); });
  $('#nextColor').addEventListener('click', function () { preloadColors(); setColor(color + 1); });
  $('.colors__row').addEventListener('pointerenter', preloadColors);

  frame.style.aspectRatio = COLORS[color].ar;
  renderCat();

  /* Кадр меняет и ширину, и пропорции (у цветов они разные) — следим
     за размером, а не за окном. */
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
    /* строка над шапкой: быстрый доступ, без пояснений */
    var top = $('#topbarLinks');
    top.innerHTML = chats.map(function () {
      return '<a class="topbar__chat" target="_blank" rel="noopener"></a>';
    }).join('');
    $$('.topbar__chat', top).forEach(function (a, i) {
      a.href = chats[i].url;
      a.textContent = chats[i].note || chats[i].name;
    });
    $('#topbar').hidden = false;

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
