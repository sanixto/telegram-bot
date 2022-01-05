const TelegramApi = require("node-telegram-bot-api");
const dotenv = require("dotenv");
const { gameOptions, againOptions } = require("./options");
const sequelize = require("./db");
const { UserModel, ChatModel } = require("./models/models");

dotenv.config();

const bot = new TelegramApi(process.env.TOKEN, { polling: true });

const startGame = async (chatId) => {
  try {
    const chat = await ChatModel.findOne({ id: chatId });
    await bot.sendMessage(
      chatId,
      "Cейчас я загадаю цифру от 0 до 9, а ты должен ее отгадать"
    );
    const randNumber = Math.floor(Math.random() * 10);
    chat.randNumber = randNumber;
    await chat.save();
    await bot.sendMessage(chatId, "Отгадывай", gameOptions);
  } catch (e) {
    console.log(e);
    bot.sendMessage(chatId, "Произшла какая-то ошибка");
  }
};

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
    const chatId = msg.chat.id;

    try {
      if (text === "/start") {
        const chat = await ChatModel.findOne({ id: chatId });
        if (!chat) await ChatModel.create({ id: chatId });

        const user = await UserModel.findOne({ chatId });
        if (user) {
          UserModel.decrement({ id: user.id });
          await user.destroy();
        }
        await UserModel.create({ chatId });
        return bot.sendMessage(chatId, "Добро пожаловать в телеграм бот");
      }
      if (text === "/info") {
        const user = await UserModel.findOne({ chatId });
        return bot.sendMessage(
          chatId,
          `У тебя ${user.right} правильных и ${user.wrong} неправильных ответов`
        );
      }
      if (text === "/game") {
        return startGame(chatId);
      }
      return bot.sendMessage(chatId, "Я не понимаю, попробуй написать еще раз");
    } catch (e) {
      console.log(e);
      bot.sendMessage(chatId, "Произошла какая-то ошибка");
    }
    return 0;
  });

  bot.on("callback_query", async (msg) => {
    const { data } = msg;
    const chatId = msg.message.chat.id;
    const chat = await ChatModel.findOne({ id: chatId });
    const user = await UserModel.findOne({ chatId });

    if (data === "/again") return startGame(chatId);
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
