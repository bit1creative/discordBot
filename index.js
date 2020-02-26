const {addUser, getRandomUser, getMyStats, getStats} =  require('./routes/router');
const {execute, skipSong, stopSong} = require('./music/music')

const Discord = require('discord.js');
const {
	prefix,
	token,
} = require('./config.json');

const client = new Discord.Client();


client.once('ready', () => {                                                // Connecting
    client.user.setActivity("!help", { type: "LISTENING"})                  // Setting the activity
    console.log('Ready!');
   });
   client.once('reconnecting', () => {
    console.log('Reconnecting!');
   });
   client.once('disconnect', () => {
    console.log('Disconnect!');
});


client.on('message', message => {                                       
    if(message.author === client.user) return;                              // Check if the message's author is bot
    if (!message.content.startsWith(prefix)) return;                        // Check if the message starts with out prefix, so we know it's a command or not.

    if(message.content.startsWith(`${prefix}help`)) {                       // Run our commands
        help(message);
    return;
    }else if (message.content.startsWith(`${prefix}game`)) {
        game(message, message.member.id);
    return;
    }else if (message.content.startsWith(`${prefix}random`)) {
        random(message);
    }else if (message.content.startsWith(`${prefix}mystats`)) {
        mystats(message,message.member.id);
    }else if (message.content.startsWith(`${prefix}stats`)) {
        stats(message);
    }else if (message.content.startsWith(`${prefix}play`)) {
        play(message);
    }else if (message.content.startsWith(`${prefix}skip`)) {
        skip(message);
    }else if (message.content.startsWith(`${prefix}stop`)) {
        stop(message);
    }else if (message.content.startsWith(`${prefix}sorry`)) {
        sorry(message);
    }else {
        message.channel.send('Wrong command, type /help to see avaible commands.')        //Error if command doesnt exist
    }
});

function help(message){
    message.channel.sendMessage('>>> Hey! \n\n***!game*** - to register. \n\n***!random*** - to choose the random guy. \n\n***!mystats*** - your own stats. \n\n***!stats*** - top 5. \n\n***!play your_url*** - play your music. \n\n***!stop*** - stop playing music. \n\n***!skip*** - play next song.');
    return;
}

function game(message, ID){
    addUser(ID,message);
    return;
}

function random(message){
    getRandomUser(message);
    return;
}

function mystats(message, ID){
    getMyStats(ID,message);
    return;
}

function stats(message){
    getStats(message);
    return;
}

function play(message){
    return new Promise((resolve, reject) => {
        if(message.member.id=='395153192653946880'){
            reject('>>> You are not allowed to use this function!')
        }else{
            resolve(message)
        }
    }).then((message) => {
        execute(message)
    }).catch((error) => {
        message.channel.send(error);
    })
}

function skip(message){
    return new Promise((resolve, reject) => {
        if(message.member.id=='395153192653946880'){
            reject('>>> You are not allowed to use this function!')
        }else{
            resolve(message)
        }
    }).then((message) => {
        skipSong(message);
    }).catch((error) => {
        message.channel.send(error);
    })
}

function stop(message){
    return new Promise((resolve, reject) => {
        if(message.member.id=='395153192653946880'){
            reject('>>> You are not allowed to use this function!')
        }else{
            resolve(message)
        }
    }).then((message) => {
        stopSong(message);
    }).catch((error) => {
        message.channel.send(error);
    })
}

function sorry(message){
    message.channel.send(`>>> <@395153192653946880> sorry! <3`);
    return; 
}

client.login(token);