const {
  ChatModel,
  UserModel,
  ChatMembershipModel,
} = require("../models/models");

const getUserModel = async (userId, username) => {
  let user = await UserModel.findOne({ where: { id: userId } });
  if (!user) user = await UserModel.create({ id: userId, username });
  return user;
};
const getChatMembershipModel = async (userId, chatId) => {
  let chatMembership = await ChatMembershipModel.findOne({
    where: { userId, chatId },
  });
  if (!chatMembership)
    chatMembership = await ChatMembershipModel.create({ userId, chatId });
  return chatMembership;
};

const getChatModel = async (chatId) => {
  return ChatModel.findOne({ where: { id: chatId } });
};

const createChatModel = async (chatId, title, memberCount) => {
  return ChatModel.create({ id: chatId, title, memberCount });
};

module.exports = {
  getUserModel,
  getChatMembershipModel,
  getChatModel,
  createChatModel,
};
