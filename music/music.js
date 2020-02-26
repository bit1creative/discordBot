const ytdl = require('ytdl-core');

const queue = new Map();

async function execute(message) {

    const serverQueue = queue.get(message.guild.id);

    const args = message.content.split(' ');
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return message.channel.send('>>> Please join the voice chat!');
     const permissions =     voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
     return message.channel.send('>>> No permission granted!');
    }

    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
        title: songInfo.title,
        url: songInfo.video_url,
    };

    if (!serverQueue) {
        const queueContract = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 2,
            playing: true,
           };
           // Setting the queue using our contract
           queue.set(message.guild.id, queueContract);
           // Pushing the song to our songs array
           queueContract.songs.push(song);
           
           try {
            // Here we try to join the voicechat and save our connection into our object.
            var connection = await voiceChannel.join();
            queueContract.connection = connection;
            // Calling the play function to start a song
            play(message.guild, queueContract.songs[0], message);
            message.channel.send(`>>> *Now playing*  **${song.title}**.\n*Requested by* ${message.guild.members.get(`${message.member.id}`)}`); 
           } catch (err) {
            // Printing the error message if the bot fails to join the voicechat
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
           }
    }else {
     serverQueue.songs.push(song);
     console.log(serverQueue.songs);
     return message.channel.send(`>>> **${song.title}** *added to the queue!*\n*Requested by* ${message.guild.members.get(`${message.member.id}`)}`);
    }
}

function play(guild, song, message) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
		return;
	}

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', (message) => {
            serverQueue.songs.shift();
            if(serverQueue.songs.length==0){
                console.log('Music ended!');
                // console.log(message)
                message.channel.send(`>>> ***Music ended!***`)
            } else {
                play(guild, serverQueue.songs[0]);
                console.log('New song is playing!')
                // console.log(message)
                message.channel.send(`>>> *Music skipped* \n*Now playing* **${song.title}**.\n*Requested by* <@${message.member.id}>`);
            }
		})
		.on('error', error => {
			console.error(error);
		});
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}


function skipSong(message) {     

    const serverQueue = queue.get(message.guild.id);                               

	if (!message.member.voiceChannel) return message.channel.send('>>> Please enter the voice channel in order !');
    if (!serverQueue) return message.channel.send('>>> There is no song that I could skip!');
    try{
        serverQueue.connection.dispatcher.end(message);
    } catch {
        message.channel.send('>>> *Music ended, nothing to skip!*')
    }
}

function stopSong(message) {

    const serverQueue = queue.get(message.guild.id);

    if (!message.member.voiceChannel) return message.channel.send('>>> PLease enter the voice channel in order to stop the music!');
    if(!serverQueue) return message.channel.send(`>>> There is nothing to stop!`)

    serverQueue.songs = [];
    try{
        serverQueue.connection.dispatcher.end(message);
        message.channel.send(`>>> *Music stopped by* <@${message.member.id}>`);
    } catch {
        message.channel.send('>>> *Music is already stopped!*')
    }
    
}


module.exports = {execute, skipSong, stopSong};