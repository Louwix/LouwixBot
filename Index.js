const Discord = require("discord.js");
const bot = new Discord.Client();
const Message = require('./Message.js');
const express = require('express');
const app = express();
const http = require('http');
const fs = require('fs');
const ytid = require('get-youtube-id');
let voiceChannel = "";

function setChannel() {
  var voiceConnection = bot.voiceConnections.first();
  if(voiceConnection != undefined){
    voiceChannel = voiceConnection.channel.name;
  } else {
    voiceChannel = "Non connecté";
  }
  console.log(voiceChannel);
}


app.use(express.static('public'));

app.get("/", (request, response) => {
  var date = new Date();
  var month = date.getMonth();
  var hour = date.getHours();
  month++;
  hour++;
  console.log(date.getDate() + '/' + month + '/' + date.getFullYear() + ' ' + hour + ':' + date.getMinutes() + ':' + date.getSeconds() + " Ping reçu");
  response.render(__dirname + '/views/index.ejs', {salon: voiceChannel});
});

app.get("/connection", function(req, res){
  res.send("Pour bientôt ;)");
});

app.get("/playlist", function(req, res){
  var data = fs.readFileSync('playlist.json', 'utf8');
  var playlist = JSON.parse(data);
  var i = 0;
  res.write('<!DOCTYPE html><html><head><meta charset="utf-8"><link rel="stylesheet" href="/style.css"></head><body>');
  while (i < playlist.length){
    var numero = i+1
    res.write('<h1>Playlist n°'+ numero + '</h1>')
    res.write('<h2>Nom de la playlist : ' + playlist[i].name + '</h2><a href="playlist/delete?id='+ i +'">❌ Supprimer</a><br/>')
    var i2 = 0;
    while(i2 < playlist[i].playlist.length){
      var id = ytid(playlist[i].playlist[i2]);
      
      res.write('<iframe width="560" height="315" src="https://www.youtube.com/embed/'+ id +'" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>');
      i2++;
    }
    i++;
  }
  res.write("</body></html>")
  res.end();
  console.log(req.query);
})

app.get("/playlist/delete", function(req, res){
  var id = req.param('id');
  fs.readFile('./playlist.json', function(err, data) {
    var playlist = JSON.parse(data);
    playlist.splice(id, 1);
    console.log(playlist)
    fs.writeFile('./playlist.json', JSON.stringify(playlist));
  });
  res.redirect('/playlist')
});



app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.NOM_DOMAINE}.glitch.me/`);
  setChannel();
}, 60000);


              
bot.login(process.env.TOKEN);
bot.on('ready', function (ready){
  bot.user.setActivity('>help');
})

bot.on('message', function (message){
	Message.Switch(message, bot, Discord);
})
bot.on('messageReactionAdd', function (reaction){
  if (reaction.users.exists('bot', false)){
  if (reaction.message.id = Message.getMessageId()){
   switch (reaction.emoji.name){
     case '⏸':
      //if(Message.music){
					bot.voiceConnections.first().dispatcher.pause();
					reaction.message.channel.send('⏸ Lecture en pause');
				//} else {
					//reaction.message.channel.send("Aucune lecture en cours");
				//}
       break
     case '▶':
      //if(Message.Switch().music){
					bot.voiceConnections.first().dispatcher.resume();
					reaction.message.channel.send('▶ Reprise de la lecture en cours');
				//} else {
					//reaction.message.channel.send("Aucune lecture en cours");
				//}
      break;
     case '🔄':
      //if(Message.Switch().music){
					//Message.Music();
          Message.Loop();
					reaction.message.channel.send('🔄 Lecture en boucle activé');
				//} else {
					//reaction.message.channel.send("Aucune lecture en cours");
				//}
      break;
     case '⏹':
     // if(music){
        bot.voiceConnections.first().dispatcher.end();
				reaction.message.channelsend('⏹ Arret de la lecture en cours');
			//} else {
				//message.channel.send("Aucune lecture en cours");
			//}
    }  
  }
  }
})