'use strict';
const dbFunc = require('../db/functions');

const startBot = async (bot, msg) => {
  const chatId = msg.chat.id;
  const chatType = msg.chat.type;
  try {
    const chat = await dbFunc.getChatModel(chatId);
    if (chat) {
      await bot.sendMessage(chatId, 'C возвращением!');
      return;
    }
    if (chatType === 'private') {
      const { username } = msg.from;
      await dbFunc.createChatModel(chatId, username);
      await bot.sendMessage(
        chatId,
        `Добро пожаловать в телеграм бот ${username}`
      );
    } else if (chatType === 'group') {
      const { title } = msg.chat;
      const memberCount = await bot.getChatMemberCount(chatId);
      await dbFunc.createChatModel(chatId, title, memberCount);
      await bot.sendMessage(chatId, `Спасибо за приглашение в группу ${title}`);
    }
  } catch (e) {
    console.log(e);
    bot.sendMessage(chatId, 'Произошла какая-то ошибка');
  }
};

module.exports = startBot;
