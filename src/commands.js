'use strict';

const dbFunc = require('./db/functions');
const { gameOptions } = require('./options');

const startBot = async (bot, msg) => {
  const chatId = msg.chat.id;
  const chatType = msg.chat.type;
  const { username } = msg.from;
  try {
    const chat = await dbFunc.getChatModel(chatId);
    if (chat) {
      await bot.sendMessage(chatId, 'C возвращением!');
      return;
    }
    if (chatType === 'private') {
      await dbFunc.createChatModel(chat, username);
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

const showInfo = async (bot, msg) => {
  const userId = msg.from.id;
  const chatId = msg.chat.id;
  const { username } = msg.from;
  try {
    const user = await dbFunc.getUserModel(userId, username);
    const chatMembership = await dbFunc.getChatMembershipModel(userId, chatId);
    let res = `${user.username}, у тебя ${chatMembership.right} правильных`;
    res += `и ${chatMembership.wrong} неправильных ответов`;
    bot.sendMessage(chatId, res);
  } catch (e) {
    await bot.sendMessage(chatId, 'Произошла какая-то ошибка');
    console.log(e);
  }
};

const startGame = async (bot, msg) => {
  const chatId = msg.chat.id;
  try {
    const chat = await dbFunc.getChatModel(chatId);
    await bot.sendMessage(
      chatId,
      'Cейчас я загадаю цифру от 0 до 9, а ты должен ее отгадать'
    );
    const randNumber = Math.floor(Math.random() * 10);
    chat.randNumber = randNumber;
    await chat.save();
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
  } catch (e) {
    console.log(e);
    await bot.sendMessage(chatId, 'Произошла какая-то ошибка');
  }
};

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

module.exports = {
  startBot,
  startGame,
  showInfo,
  aboutBot,
  showTop,
};
