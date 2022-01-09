'use strict';

const dbFunc = require('../db/functions');

const showInfo = async (bot, msg) => {
  const userId = msg.from.id;
  const chatId = msg.chat.id;
  const { username } = msg.from;
  try {
    const user = await dbFunc.getUserModel(userId, username);
    if (!user) return bot.sendMessage(
      chatId,
      'Вы еще не играли в игру "Угадай число"'
    );
    if (username !== user.username)
      await dbFunc.updateUserModel(user, username);
    const chatMembership = await dbFunc.getChatMembershipModel(userId, chatId);
    let res = `${user.username}, у тебя ${chatMembership.right} правильных`;
    res += `и ${chatMembership.wrong} неправильных ответов`;
    bot.sendMessage(chatId, res);
  } catch (e) {
    await bot.sendMessage(chatId, 'Произошла какая-то ошибка');
    console.log(e);
  }
};

module.exports = showInfo;
