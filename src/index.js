const TelegramApi = require("node-telegram-bot-api");
const dotenv = require("dotenv");
const { againOptions } = require("./options");
const sequelize = require("./db/db");
const { ChatModel } = require("./models/models");
const commands = require("./commads");
const associate = require("./db/associate");

dotenv.config();

const bot = new TelegramApi(process.env.TOKEN, { polling: true });

const start = async () => {
  try {
    associate();
    await sequelize.authenticate();
    await sequelize.sync();
  } catch (e) {
    console.log("Подключение к БД сломалось", e);
  }

  bot.setMyCommands([
    { command: "/start", description: "Начальное приветсвтвие" },
    { command: "/info", description: "Информация о пользователе" },
    { command: "/game", description: "Игра угадай цифру" },
  ]);

  bot.on("message", async (msg) => {
    const { text } = msg;
    const chatId = msg.chat.id;
    const chatType = msg.chat.type;
    const botName = (await bot.getMe()).username;

    console.log(msg);

    try {
      if (chatType === "private") {
        if (text === "/start") return commands.startBot(bot, msg);
        if (text === "/info") return commands.showInfo(bot, msg);
        if (text === "/game") return commands.startGame(bot, msg);
        return bot.sendMessage(
          chatId,
          "Я не понимаю, попробуй написать еще раз"
        );
      }
      if (chatType === "group") {
        if (text === "/start" || text === `/start@${botName}`) return commands.startBot(bot, msg);
        if (text === "/info" || text === `/info@${botName}`) return commands.showInfo(bot, msg);
        if (text === "/game" || text === `/game@${botName}`) return commands.startGame(bot, msg);
        return bot.sendMessage(
          chatId,
          "Я не понимаю, попробуй написать еще раз"
        );
      }
    } catch (e) {
      console.log(e);
      bot.sendMessage(chatId, "Произошла какая-то ошибка");
    }
    return 0;
  });

  bot.on("callback_query", async (msg) => {
    const { data } = msg;
    const userId = msg.from.id;
    const chatId = msg.message.chat.id;

    const chat = await ChatModel.findOne({ where: { id: chatId } });
    const chatMembership = await commands.getChatMembershipModel(
      userId,
      chatId
    );

    if (data === "/again") return commands.startGame(bot, msg.message);
    if (Number(data) === chat.randNumber) {
      chatMembership.right += 1;
      await bot.sendMessage(
        chatId,
        `Поздравляю, ты отгадал цифру ${chat.randNumber}`,
        againOptions
      );
    } else {
      chatMembership.wrong += 1;
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
