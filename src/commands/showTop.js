'use strict';

const dbFunc = require('../db/functions');

const showTop = async (bot, msg) => {
  const chatType = msg.chat.type;
  const chatId = msg.chat.id;
  if (chatType !== 'group')
    return bot.sendMessage(chatId, 'Вы находитесь не в не группе');

  const chatMembers = await dbFunc.getChatMembers(chatId);

  let html = `
      <strong>Топ 10 игроков</strong><pre>
    `;

  for (const member of chatMembers) {
    const user = await dbFunc.getUserModel(member.userId);
    html += `${user.username}: ${member.right} правильных `;
    html += `и ${member.wrong} неправильных`;
    html += `
    `;
  }
  html += `</pre>`;

  await bot.sendMessage(chatId, html, {
    parse_mode: 'HTML',
  });
};

module.exports = showTop;
