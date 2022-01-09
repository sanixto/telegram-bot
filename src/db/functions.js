'use strict';

const {
  ChatModel,
  UserModel,
  ChatMembershipModel,
} = require('../models/models');

const createUserModel = async (userId, username) =>
  UserModel.create({ id: userId, username });

const updateUserModel = async (user, username) => {
  user.username = username;
  await user.save();
};

const getUserModel = async userId =>
  UserModel.findOne({ where: { id: userId } });

const createChatMembershipModel = async (userId, chatId) =>
  await ChatMembershipModel.create({ userId, chatId });

const updateChatMembershipModel = async (chatMembership, right, wrong) => {
  if (right) chatMembership.right = right;
  if (wrong) chatMembership.wrong = wrong;
  await chatMembership.save();
};

const getChatMembershipModel = async (userId, chatId) =>
  ChatMembershipModel.findOne({ where: { userId, chatId } });

const createChatModel = async (chatId, title, memberCount) =>
  ChatModel.create({ id: chatId, title, memberCount });

const updateChatModel = async (chat, title, memberCount, randNumber) => {
  if (title) chat.title = title;
  if (memberCount) chat.memberCount = memberCount;
  if (randNumber) chat.randNumber = randNumber;
  await chat.save();
};

const getChatModel = async chatId =>
  ChatModel.findOne({ where: { id: chatId } });

const getChatMembers = async chatId =>
  ChatMembershipModel.findAll({ where: { chatId } });

module.exports = {
  createUserModel,
  createChatModel,
  createChatMembershipModel,
  updateUserModel,
  updateChatModel,
  updateChatMembershipModel,
  getUserModel,
  getChatMembershipModel,
  getChatModel,
  getChatMembers,
};
