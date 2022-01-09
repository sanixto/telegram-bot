'use strict';

const dbFunc = require('../db/functions');
const { gameOptions } = require('../options');

const restartGame = async (bot, msg) => {
  const chatId = msg.chat.id;
  try {
    const chat = await dbFunc.getChatModel(chatId);
    await bot.sendMessage(
      chatId,
      'Cейчас я загадаю цифру от 0 до 9, а ты должен ее отгадать'
    );
    const randNumber = Math.floor(Math.random() * 10);
    await dbFunc.updateChatModel(chat, null, null, randNumber);
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
  } catch (e) {
    console.log(e);
    await bot.sendMessage(chatId, 'Произошла какая-то ошибка');
  }
};

module.exports = restartGame;
