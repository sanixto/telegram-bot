const { ChatModel, UserModel } = require("./models/models");
const { gameOptions } = require("./options");

const startGame = async (bot, chatId) => {
  try {
    const chat = await ChatModel.findOne({ where: { id: chatId } });
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
    await bot.sendMessage(chatId, "Произошла какая-то ошибка");
  }
};

const startBot = async (bot, chatId, typeChat = "private") => {
  try {
    const chat = await ChatModel.findOne({ where: { id: chatId } });
    if (chat) {
      await bot.sendMessage(chatId, "C возвращением!");
      return;
    }
    await ChatModel.create({ id: chatId });
    if (typeChat === "private")
      await bot.sendMessage(chatId, "Добро пожаловать в телеграм бот");
    else await bot.sendMessage(chatId, "Спасибо за приглашение)");
  } catch (e) {
    bot.sendMessage(chatId, "Произошла какая-то ошибка");
  }
};

const showInfo = async (bot, userId, chatId) => {
  try {
    const user = await UserModel.findOne({ where: { id: userId, chatId } });
    if (!user) await UserModel.create({ id: userId, chatId });
    bot.sendMessage(
      chatId,
      `У тебя ${user.right} правильных и ${user.wrong} неправильных ответов`
    );
  } catch (e) {
    await bot.sendMessage(chatId, "Произошла какая-то ошибка");
    console.log(e);
  }
};

module.exports = {
  startBot,
  startGame,
  showInfo,
};
