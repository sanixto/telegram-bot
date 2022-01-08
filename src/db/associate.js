'use strict';

const {
  UserModel,
  ChatModel,
  ChatMembershipModel,
} = require('../models/models');

const associate = () => {
  UserModel.hasMany(ChatMembershipModel, {
    foreignKey: 'userId',
    sourceKey: 'id',
  });

  ChatMembershipModel.belongsTo(UserModel, {
    foreignKey: 'userId',
    as: 'user',
    targetKey: 'id',
  });

  ChatModel.hasMany(ChatMembershipModel, {
    foreignKey: 'chatId',
    sourceKey: 'id',
  });

  ChatMembershipModel.belongsTo(ChatModel, {
    foreignKey: 'chatId',
    as: 'chat',
    targetKey: 'id',
  });
};

module.exports = associate;
