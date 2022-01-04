const TelegramApi = require('node-telegram-bot-api');
const dotenv = require('dotenv');
const { gameOptions, againOptions } = require('./options');

dotenv.config();

const bot = new TelegramApi(process.env.TOKEN, { polling: true });

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Cейчас я загадаю цифру от 0 до 9, а ты должен ее отгадать');
    const randNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

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
        return startGame(chatId);
    }
    return bot.sendMessage(chatId, 'Я не понимаю, попробуй написать еще раз');
})

bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === '/again') startGame(chatId);
    if (data == chats[chatId]) return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions);
    else return bot.sendMessage(chatId, `Ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions);  
})