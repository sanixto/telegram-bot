const TelegramApi = require('node-telegram-bot-api');

const token = '5098014166:AAExRO90LgqiQbtCXxwtaUIgle7_aIgrvLY';

const bot = new TelegramApi(token, { polling: true });

bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === '/start') await bot.sendMessage(chatId, 'Добро пожаловать в телеграм бот');
    if (text === '/info') await bot.sendMessage(chatId, 'Этот бот был создан для ....');
    console.log(msg);
})