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
///////////////////////////////////////////////////////////////////////////////
// view avatar
 client.on('message', message => {
   // If the message is "what is my avatar"
   if (message.content === 'what is my avatar') {
     // Send the user's avatar URL
     message.reply(message.author.displayAvatarURL());
   }
 });
///////////////////////////////////////////////////////////////////////////////
// simple reply
 client.on('message', msg => {
  if (msg.content === 'marco') {
    msg.reply('Fuck you Philip');
  }
});
///////////////////////////////////////////////////////////////////////////////
// attachments
client.on('message', message => {
  // If the message is '!rip'
  if (message.content === '!rip') {
    // Create the attachment using MessageAttachment
    const attachment = new Discord.MessageAttachment('https://i.imgur.com/w3duR07.png');
    // Send the attachment in the message channel
    message.channel.send(attachment);
  }
});
///////////////////////////////////////////////////////////////////////////////
// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`Welcome to the server, ${member}`);
});
///////////////////////////////////////////////////////////////////////////////
//embedded message
client.on('message', message => {
  // If the message is "how to embed"
  if (message.content === 'how to embed') {
    // We can create embeds using the MessageEmbed constructor
    // Read more about all that you can do with the constructor
    // over at https://discord.js.org/#/docs/main/master/class/MessageEmbed
    const embed = new Discord.MessageEmbed()
      // Set the title of the field
      .setTitle('A slick little embed')
      // Set the color of the embed
      .setColor(0xff0000)
      // Set the main content of the embed
      .setDescription('Hello, this is a slick embed!');
    // Send the embed to the same channel as the message
    message.channel.send(embed);
  }
});
