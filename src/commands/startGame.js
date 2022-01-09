'use strict';

const restartGame = require('./restartGame');
const dbFunc = require('../db/functions');

const startGame = async (bot, msg, playerId) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const username = msg.from.username;

  try {
    if (playerId) {
      if (playerId === userId) return bot.sendMessage(
        chatId,
        'Ты уже в игре, нажми кнопку Отмена, чтобы закончить игру'
      );
      const player = await dbFunc.getUserModel(playerId);
      return bot.sendMessage(
        chatId,
        `Подожите пока игрок ${player.username} закончит игру`
      );
    }
    const user = await dbFunc.getUserModel(userId);
    if (!user) await dbFunc.createUserModel(userId, username);
    return restartGame(bot, msg);
  } catch (e) {
    console.log(e);
    await bot.sendMessage(chatId, 'Произошла какая-то ошибка');
  }
};

module.exports = startGame;
