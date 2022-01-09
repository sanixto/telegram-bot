'use strict';

const showCommands = async (bot, msg) => {
  const chatId = msg.chat.id;
  const commands = await bot.getMyCommands();
  let html = `<strong>Список всех комманд</strong>
      <i>`;
  for (const elem of commands) {
    html += `/${elem.command} - ${elem.description}`;
    html += `
      `;
  }
  html += '</i>';
  await bot.sendMessage(chatId, html, {
    parse_mode: 'HTML',
  });
};

module.exports = showCommands;
