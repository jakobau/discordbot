const Discord = require('discord.js');
const client = new Discord.Client();

// use auth.json to get secret token
const fs = require('fs');
const jsonString = fs.readFileSync('./auth.json');
const customer = JSON.parse(jsonString);
client.login(customer.token);

// confirm connection
client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
 });

// view avatar
 client.on('message', message => {
   // If the message is "what is my avatar"
   if (message.content === 'what is my avatar') {
     // Send the user's avatar URL
     message.reply(message.author.displayAvatarURL());
   }
 });

// simple reply
 client.on('message', msg => {
  if (msg.content === 'marco') {
    msg.reply('Fuck you Philip');
  }
});
