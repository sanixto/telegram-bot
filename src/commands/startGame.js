'use strict';

const restartGame = require('./restartGame');
const dbFunc = require('../db/functions');

const startGame = async (bot, msg, player) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const username = msg.from.username;

  try {
    if (player.id) {
      if (player.id === userId) return bot.sendMessage(
        chatId,
        'Ты уже в игре, нажми кнопку Отмена, чтобы закончить игру'
      );
      else return bot.sendMessage(
        chatId,
        `Подожите пока игрок ${player.username} закончит игру`
      );
    }
    const user = await dbFunc.getUserModel(userId);
    if (!user) await dbFunc.createUserModel(userId, username);
    player.id = user.id;
    player.username = user.username;
    return restartGame(bot, msg);
  } catch (e) {
    console.log(e);
    await bot.sendMessage(chatId, 'Произошла какая-то ошибка');
  }
};

module.exports = startGame;
