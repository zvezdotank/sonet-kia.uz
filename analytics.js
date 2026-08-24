/* Аналитика и цели. Без идентификатора в config.js ничего не грузится,
   поэтому файл безопасно висит на всех страницах заранее. */
(function () {
  'use strict';
  var id = ((window.SONET && window.SONET.ga4) || '').trim();
  if (!id) return;

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', id);

  function track(name, params) { gtag('event', name, params || {}); }
  window.sonetTrack = track;

  // Уход в Telegram считаем в момент нажатия: вкладка открывается сразу,
  // и событие может не успеть отправиться после.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (a && (a.getAttribute('href') || '').indexOf('t.me/') > -1) {
      track('telegram_click', { chat: a.textContent.trim().slice(0, 60) });
      return;
    }
    // Что именно смотрят в конфигураторе — этим потом правят фотоподборку
    var sw = e.target.closest && e.target.closest('.sw');
    if (sw) track('color_pick', { color: sw.querySelector('.sw__name').textContent });
  }, true);
})();
