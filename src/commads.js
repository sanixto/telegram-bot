const { ChatModel, UserModel } = require("./models/models");
const { gameOptions } = require("./options");

const startGame = async (bot, msg) => {
  const chatId = msg.chat.id;
  const typeChat = msg.chat.type;
  try {
    const chat = await ChatModel.findOne({ where: { id: chatId } });
    if (typeChat === "private")
      await bot.sendMessage(
        chatId,
        "Cейчас я загадаю цифру от 0 до 9, а ты должен ее отгадать"
      );
    else if (typeChat === "group")
      await bot.sendMessage(
        chatId,
        "Cейчас я загадаю цифру от 0 до 9, а вы должены ее отгадать"
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

const startBot = async (bot, msg) => {
  const chatId = msg.chat.id;
  const chatType = msg.chat.type;
  const { username } = msg.from;
  try {
    const chat = await ChatModel.findOne({ where: { id: chatId } });
    if (chat) {
      await bot.sendMessage(chatId, "C возвращением!");
      return;
    }
    if (chatType === "private") {
      await ChatModel.create({ id: chatId, title: username });
      await bot.sendMessage(
        chatId,
        `Добро пожаловать в телеграм бот ${username}`
      );
    } else if (chatType === "group") {
      const { title } = msg.chat;
      const memberCount = await bot.getChatMemberCount(chatId);
      await ChatModel.create({ id: chatId, title, memberCount });
      await bot.sendMessage(chatId, `Спасибо за приглашение в группу ${title}`);
    }
  } catch (e) {
    console.log(e);
    bot.sendMessage(chatId, "Произошла какая-то ошибка");
  }
};

const showInfo = async (bot, msg) => {
  const userId = msg.from.id;
  const chatId = msg.chat.id;
  const { username } = msg.from;
  try {
    const user = await UserModel.findOne({ where: { id: userId } });
    if (!user) await UserModel.create({ id: userId, username });
    bot.sendMessage(
      chatId,
      `${user.username}, у тебя x правильных и x неправильных ответов`
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
