'use strict';

const startBot = require('./startBot');
const showInfo = require('./showInfo');
const startGame = require('./startGame');
const restartGame = require('./restartGame');
const stopGame = require('./stopGame');
const aboutBot = require('./aboutBot');
const showTop = require('./showTop');
const showCommands = require('./showCommands');

module.exports = {
  startBot,
  startGame,
  restartGame,
  stopGame,
  showInfo,
  aboutBot,
  showTop,
  showCommands,
};
