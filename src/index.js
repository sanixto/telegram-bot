const TelegramApi = require("node-telegram-bot-api");
const dotenv = require("dotenv");
const { againOptions } = require("./options");
const sequelize = require("./db");
const { UserModel, ChatModel } = require("./models/models");
const commands = require("./commads");

dotenv.config();

const bot = new TelegramApi(process.env.TOKEN, { polling: true });

const start = async () => {
  try {
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
    const userId = msg.from.id;
    const chatId = msg.chat.id;
    const typeChat = msg.chat.type;
    console.log(msg);

    try {
      if (typeChat === "private") {
        if (text === "/start") return commands.startBot(bot, chatId);
        if (text === "/info") return commands.showInfo(bot, userId, chatId);
        if (text === "/game") return commands.startGame(bot, chatId);
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
    const user = await UserModel.findOne({ where: { id: userId, chatId } });
    if (!user) await UserModel.create({ id: userId, chatId });

    if (data === "/again") return commands.startGame(bot, chatId);
    if (Number(data) === chat.randNumber) {
      user.right += 1;
      await bot.sendMessage(
        chatId,
        `Поздравляю, ты отгадал цифру ${chat.randNumber}`,
        againOptions
      );
    } else {
      user.wrong += 1;
      await bot.sendMessage(
        chatId,
        `Ты не угадал, бот загадал цифру ${chat.randNumber}`,
        againOptions
      );
    }
    await user.save();
    return 0;
  });
};

start();
