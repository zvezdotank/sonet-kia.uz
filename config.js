/* Единственное место, где живут внешние идентификаторы и ссылки.
   Пока значение пустое — механика просто выключена и ничего не ломается:
   счётчик не грузится, блок чатов не показывается. */
window.SONET = {
  // Идентификатор Google Analytics 4, вида G-XXXXXXXXXX
  ga4: '',

  // Группы владельцев Sonet в Telegram. Пока список пуст, блок «Живое
  // общение» на страницах не появляется — ссылка в никуда хуже, чем её
  // отсутствие. Добавлять так:
  //   { name: 'Kia Sonet Узбекистан', note: 'общий чат владельцев',
  //     url: 'https://t.me/...' },
  chats: [
    { name: 'Kia Sonet Узбекистан', note: '@kiasonetuzbekistan',
      url: 'https://t.me/kiasonetuzbekistan' },
    { name: 'Kia Sonet Club', note: '@kia_sonet_club',
      url: 'https://t.me/kia_sonet_club' }
  ]
};
