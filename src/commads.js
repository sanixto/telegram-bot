const { ChatModel, UserModel } = require("./models/models");
const { gameOptions } = require("./options");

const startGame = async (bot, chatId) => {
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
    await bot.sendMessage(chatId, "Произошла какая-то ошибка");
  }
};

const startBot = async (bot, chatId) => {
  const chat = await ChatModel.findOne({ id: chatId });
  if (!chat) await ChatModel.create({ id: chatId });

  const user = await UserModel.findOne({ chatId });
  if (user) {
    UserModel.decrement({ id: user.id });
    await user.destroy();
  }
  await UserModel.create({ chatId });
  await bot.sendMessage(chatId, "Добро пожаловать в телеграм бот");
};

const showInfo = async (bot, chatId) => {
  const user = await UserModel.findOne({ chatId });
  await bot.sendMessage(
    chatId,
    `У тебя ${user.right} правильных и ${user.wrong} неправильных ответов`
  );
};

module.exports = {
  startBot,
  startGame,
  showInfo,
};
