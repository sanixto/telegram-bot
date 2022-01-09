'use strict';

const aboutBot = async (bot, msg) => {
  const chatId = msg.chat.id;
  const html = `
      Этот бот был создан для игры "Угадай число"
      <i>Автор: @sanix_to</i>
    `;
  bot.sendMessage(chatId, html, {
    parse_mode: 'HTML',
  });
};

module.exports = aboutBot;
