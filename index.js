const TelegramApi = require('node-telegram-bot-api');

const token = '5098014166:AAExRO90LgqiQbtCXxwtaUIgle7_aIgrvLY';

const bot = new TelegramApi(token, { polling: true });

const chats = {};

bot.setMyCommands([
    {command: '/start', description: 'Начальное приветсвтвие'},
    {command: '/info', description: 'Информация о боте'},
    {command: '/game', description: 'Игра угадай цыфру'}
])

bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === '/start') return bot.sendMessage(chatId, 'Добро пожаловать в телеграм бот');
    if (text === '/info') return bot.sendMessage(chatId, 'Этот бот был создан для ....');
    if (text === '/game') {
        await bot.sendMessage(chatId, 'Cейчас я загадаю цифру от 0 до 9, а ты должен ее отгадать');
        const randNumber = Math.floor(Math.random() * 10);
        chats[chatId] = randNumber;
        return bot.sendMessage(chatId, 'Отгадывай');
    }
    return bot.sendMessage(chatId, 'Я не понимаю, попробуй написать еще раз');
    console.log(msg);
})