'use strict';

const TelegramApi = require('node-telegram-bot-api');
const dotenv = require('dotenv');
const { againOptions } = require('./options');
const sequelize = require('./db/db');
const dbFunc = require('./db/functions');
const commands = require('./commands/commands');
const associate = require('./db/associate');

dotenv.config();

const bot = new TelegramApi(process.env.TOKEN, { polling: true });

const start = async () => {
  let playerId = null;
  try {
    associate();
    await sequelize.authenticate();
    await sequelize.sync();
  } catch (e) {
    console.log('Подключение к БД сломалось', e);
  }

  bot.setMyCommands([
    { command: '/start', description: 'Начальное приветствие' },
    { command: '/game', description: 'Игра угадай цифру' },
    { command: '/info', description: 'Информация о пользователе' },
    { command: '/top', description: 'Топ 10 игроков в группе' },
    { command: '/about', description: 'Информация о боте' },
    { command: '/help', description: 'Cписок всех комманд' },
  ]);

  bot.on('message', async msg => {
    const { text } = msg;
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const chatType = msg.chat.type;
    const botName = (await bot.getMe()).username;

    console.log(msg);

    try {
      if (text === '/start' || text === `/start@${botName}`)
        return commands.startBot(bot, msg);
      if (text === '/info' || text === `/info@${botName}`)
        return commands.showInfo(bot, msg);
      if (text === '/game' || text === `/game@${botName}`) {
        await commands.startGame(bot, msg, null, playerId);
        playerId = userId;
        return;
      }
      if (text === '/about' || text === `/about@${botName}`)
        return commands.aboutBot(bot, msg);
      if (text === '/top' || text === `/top@${botName}`)
        return commands.showTop(bot, msg);
      if (text === '/help' || text === `/help@${botName}`)
        return commands.showCommands(bot, msg);
      if (chatType === 'private') return bot.sendMessage(
        chatId,
        'Я не понимаю, попробуй написать еще раз'
      );
    } catch (e) {
      console.log(e);
      bot.sendMessage(chatId, 'Произошла какая-то ошибка');
    }
    return 0;
  });

  bot.on('callback_query', async query => {
    const { data } = query;
    const chatId = query.message.chat.id;
    const userId = query.from.id;
    const messageId = query.message.message_id;

    if (playerId && playerId !== userId) {
      const player = await dbFunc.getUserModel(playerId);
      player.catch(err => console.log(err));
      return bot.sendMessage(
        chatId,
        `Играет ${player.username}. Запустите игру с помощью комманды /game`
      );
    }

    const chat = await dbFunc.getChatModel(chatId);
    const chatMembership = await dbFunc.getChatMembershipModel(userId, chatId);

    if (data === '/cancel') {
      await commands.stopGame(bot, query.message);
      playerId = null;
      return;
    }
    if (data === '/again') {
      await commands.stopGame(bot, query.message);
      return commands.restartGame(bot, query.message);
    }
    if (Number(data) === chat.randNumber) {
      dbFunc.updateChatMembershipModel(chatMembership,
        chatMembership.right + 1, null);
      await bot.deleteMessage(chatId, messageId);
      await bot.sendMessage(
        chatId,
        `Поздравляю, ты отгадал цифру ${chat.randNumber}`,
        againOptions
      );
    } else {
      dbFunc.updateChatMembershipModel(chatMembership,
        null, chatMembership.wrong + 1);
      await bot.deleteMessage(chatId, messageId);
      await bot.sendMessage(
        chatId,
        `Ты не угадал, бот загадал цифру ${chat.randNumber}`,
        againOptions
      );
    }
    return 0;
  });
};

start();
