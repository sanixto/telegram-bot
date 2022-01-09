'use strict';

const stopGame = async (bot, msg) => {
  const chatId = msg.chat.id;
  const { text } = msg;
  const messageId = msg.message_id;

  return bot.editMessageText(text, {
    chat_id: chatId,
    message_id: messageId,
  });
};

module.exports = stopGame;
