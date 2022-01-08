'use strict';

const TelegramApi = require('node-telegram-bot-api');
const dotenv = require('dotenv');
const { againOptions } = require('./options');
const sequelize = require('./db/db');
const dbFunc = require('./db/functions');
const commands = require('./commands');
const associate = require('./db/associate');

dotenv.config();

const bot = new TelegramApi(process.env.TOKEN, { polling: true });

const start = async () => {
  let userId;
  try {
    associate();
    await sequelize.authenticate();
    await sequelize.sync();
  } catch (e) {
    console.log('Подключение к БД сломалось', e);
  }

  bot.setMyCommands([
    { command: '/start', description: 'Начальное приветсвтвие' },
    { command: '/info', description: 'Информация о пользователе' },
    { command: '/game', description: 'Игра угадай цифру' },
    { command: '/about', description: 'Информация о боте' },
    { command: '/top', description: 'Топ 10 игроков в группе' },
  ]);

  bot.on('message', async msg => {
    const { text } = msg;
    const chatId = msg.chat.id;
    const chatType = msg.chat.type;
    const botName = (await bot.getMe()).username;
    userId = msg.from.id;

    console.log(msg);

    try {
      if (chatType === 'private') {
        if (text === '/start') return commands.startBot(bot, msg);
        if (text === '/info') return commands.showInfo(bot, msg);
        if (text === '/game') return commands.startGame(bot, msg);
        if (text === '/about') return commands.aboutBot(bot, msg);
        if (text === '/top') return commands.showTop(bot, msg);
        return bot.sendMessage(
          chatId,
          'Я не понимаю, попробуй написать еще раз'
        );
      }
      if (chatType === 'group') {
        if (text === '/start' || text === `/start@${botName}`)
          return commands.startBot(bot, msg);
        if (text === '/info' || text === `/info@${botName}`)
          return commands.showInfo(bot, msg);
        if (text === '/game' || text === `/game@${botName}`)
          return commands.startGame(bot, msg);
        if (text === '/about' || text === `/about@${botName}`)
          return commands.aboutBot(bot, msg);
        if (text === '/top' || text === `/top@${botName}`)
          return commands.showTop(bot, msg);
        return bot.sendMessage(
          chatId,
          'Я не понимаю, попробуй написать еще раз'
        );
      }
    } catch (e) {
      console.log(e);
      bot.sendMessage(chatId, 'Произошла какая-то ошибка');
    }
    return 0;
  });

  bot.on('callback_query', async query => {
    const { data } = query;
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    const { username } = query.from;

    const user = await dbFunc.getUserModel(userId, username);
    if (userId !== query.from.id)
      return bot.sendMessage(
        chatId,
        `Играет ${user.username}. Запустите игру с помощью комманды /game`
      );

    const chat = await dbFunc.getChatModel(chatId);
    const chatMembership = await dbFunc.getChatMembershipModel(userId, chatId);

    if (data === '/again') {
      await bot.editMessageText(query.message.text, {
        chat_id: chatId,
        message_id: messageId,
      });
      return commands.startGame(bot, query.message);
    }
    if (Number(data) === chat.randNumber) {
      chatMembership.right += 1;
      await bot.deleteMessage(chatId, messageId);
      await bot.sendMessage(
        chatId,
        `Поздравляю, ты отгадал цифру ${chat.randNumber}`,
        againOptions
      );
    } else {
      chatMembership.wrong += 1;
      await bot.deleteMessage(chatId, messageId);
      await bot.sendMessage(
        chatId,
        `Ты не угадал, бот загадал цифру ${chat.randNumber}`,
        againOptions
      );
    }
    await chatMembership.save();
    return 0;
  });
};

start();
