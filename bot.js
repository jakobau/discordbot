const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require('./auth.json');
const ytdl = require('ytdl-core');
var FFmpeg = require('ffmpeg');

const queue = new Map();

client.login(token);

// connection
client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
});
client.once('reconnecting', () => {
  console.log('Reconnecting!');
});
client.once('disconnect', () => {
  console.log('Disconnect!');
});

///////////////////////////////////////////////////////////////////////////////
// view avatar
  client.on('message', async message => {
    if (message.author.bot) return; //message from own bot

    // simple reply
    if (message.content === 'marco') {
     message.reply('Spread Happiness');
     return;
    }

    // If the message is "what is my avatar"
    if (message.content === 'what is my avatar') {
     // Send the user's avatar URL
     message.reply(message.author.displayAvatarURL());
     return;
    }

    // If the message is '!rip'
    if (message.content === '!rip') {
     // Create the attachment using MessageAttachment
     const attachment = new Discord.MessageAttachment('https://i.imgur.com/w3duR07.png');
     // Send the attachment in the message channel
     message.channel.send(attachment);
     return;
    }

    // harass phillip
    if (message.member.user.tag === "cooncoon#8959") {
     message.reply("you cannot make me go away");
     return;
    }

    // start music bot
    if (!message.content.startsWith(prefix)) return;

    var serverQueue = queue.get(message.guild.id);

    if (message.content.startsWith(prefix + 'play')) {
      message.reply("execute");
      execute(message, serverQueue);
      return;
    } else if (message.content.startsWith(prefix + 'skip')) {
      skip(message, serverQueue);
      return;
    } else if (message.content.startsWith(prefix + 'stop')) {
      stop(message, serverQueue);
      return;
    } else {
      message.channel.send("You need to enter a valid command!");
    }

/*
   // If the message is "how to embed"
   if (message.content.includes("jakob") || message.content.includes("jake") || message.content.includes("Jake") || message.content.includes("Jakob")) {
     // We can create embeds using the MessageEmbed constructor
     // Read more about all that you can do with the constructor
     // over at https://discord.js.org/#/docs/main/master/class/MessageEmbed
     const embed = new Discord.MessageEmbed()
       // Set the title of the field
       .setTitle('PHILIP I AM WATCHING U')
       // Set the color of the embed
       .setColor(0xff0000)
       // Set the main content of the embed
       .setDescription('Dick my Suck');
     // Send the embed to the same channel as the message
     message.channel.send(embed);
   }
*/

 });

 async function execute(message, serverQueue) {
   const args = message.content.split(" ");

   const voiceChannel = message.member.voice.channel;
   if (!voiceChannel)
     return message.channel.send(
       "You need to be in a voice channel to play music!"
     );
   const permissions = voiceChannel.permissionsFor(message.client.user);
   if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
     return message.channel.send(
       "I need the permissions to join and speak in your voice channel!"
     );
   }

   const songInfo = await ytdl.getInfo(args[1]);
   const song = {
     title: songInfo.title,
     url: songInfo.video_url,
    };

    if (!serverQueue) {
      // Creating the contract for our queue
      const queueContruct = {
       textChannel: message.channel,
       voiceChannel: voiceChannel,
       connection: null,
       songs: [],
       volume: 5,
       playing: true,
      };
      // Setting the queue using our contract
      queue.set(message.guild.id, queueContruct);
      // Pushing the song to our songs array
      queueContruct.songs.push(song);

      try {
       // Here we try to join the voicechat and save our connection into our object.
       var connection = await voiceChannel.join();
       queueContruct.connection = connection;
       // Calling the play function to start a song
       play(message.guild, queueContruct.songs[0]);
      } catch (err) {
       // Printing the error message if the bot fails to join the voicechat
       console.log(err);
       queue.delete(message.guild.id);
       return message.channel.send(err);
      }
    }else {
     serverQueue.songs.push(song);
     console.log(serverQueue.songs);
     return message.channel.send(song.title+' has been added to the queue!');
    }

 }

function skip(message, serverQueue) {
 if (!message.member.voice.channel)
   return message.channel.send(
     "You have to be in a voice channel to stop the music!"
   );
 if (!serverQueue)
   return message.channel.send("There is no song that I could skip!");
 serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
 if (!message.member.voice.channel)
   return message.channel.send(
     "You have to be in a voice channel to stop the music!"
   );
 serverQueue.songs = [];
 serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
 const serverQueue = queue.get(guild.id);
 if (!song) {
   serverQueue.voiceChannel.leave();
   queue.delete(guild.id);
   return;
 }

 const dispatcher = serverQueue.connection
   .play(ytdl(song.url))
   .on("finish", () => {
     serverQueue.songs.shift();
     play(guild, serverQueue.songs[0]);
   })
   .on("error", error => console.error(error));
 dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
 serverQueue.textChannel.send('Start playing: **'+song.title+'**');
}

///////////////////////////////////////////////////////////////////////////////

// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send('Welcome to the server, '+member);
});
