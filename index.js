const fs = require('fs');
const Discord = require('discord.js');
const {prefix, token} = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    //Set a new item in the collection with the key as the command name
    //and the value as the exported module
    client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.once('ready', () => {
    console.log('Squid Acolyte, ready!');
});


client.on('message', message => {
    //If the message doesn't start with ~ or the command caller is a bot, do nothing
    console.log('Message detected, chirp!');
    if (!message.content.startsWith(prefix) || message.author.bot)
    return;
    
    //Command preprocessing: splitting multiple arguments into elements and removing the calling command
    //to handle separate arguments
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase()

    //If the command does not exist, do nothing.
    if (!client.commands.has(commandName)) {
        return message.reply("That command doesn't exist, chirp!");
    }

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.args && !args.length) {
        return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now)/ 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command!`);
        }
    }
    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply("Chirp! There was an error and I couldn't execute the command! Q_Q");
    }
})

client.login(token);