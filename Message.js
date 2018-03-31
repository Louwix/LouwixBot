const ytdl = require('ytdl-core');
const ytsearch = require('youtube-search');
const ytinfo = require('youtube-info');
const ytid = require('get-youtube-id');
const Cours = require('./Bases requises.js');
const fs = require('fs');
var data = fs.readFileSync('playlist.json', 'utf8');
var volume = 0.5;
var channel = '';
var music = false;
var loop = false;
var file = [];
var expo = 0
var messageId = 0
var delay;


module.exports = class Message{
  static getessageId(){
    return messageId;
  }
  static Loop (){
    loop = true;
  }
  static Switch (message, bot, Discord){
    function start (url){
      console.log(url)
			const stream = ytdl(url.link, { filter : 'audioonly' });
			const streamOptions = { volume: volume, bitrate: 10000 };
			stream.on('error', function(error){
				message.channel.send('Lien invalide');
        console.log(error);
			})
			music = true;
      message.channel.send(new Discord.RichEmbed() 
        .setTitle('Lecture en cours ▶')
        .addField("Nom de la musique", url.title)
        .addField("Auteur", url.owner)
        .addField("Durée", url.duration)
        .addField("Date de publication", url.date)
        .setThumbnail(url.thumbnail)
      )
        .then(function (messageStart){
          messageStart.react('▶');
          messageStart.react('⏸');
          messageStart.react('🔄');
          messageStart.react('⏹');
          messageId = messageStart.id; 
        })
			const dispatcher = bot.voiceConnections.first().playStream(stream, streamOptions).on('end', function(){
				music = false;
        if(loop){ 
          start(file[0]);
        } else {
          if(file[1] !== undefined){
            file.shift();
            start(file[0]); 
          } else {
            file.shift();
          }
        }
      });
    }
    function checkUrl(url){
    
    }
    function play(args, playlist){
      console.log(args);
      if(bot.voiceConnections.first() == undefined){
					message.channel.send('Le bot n\'est pas connecté à un salon vocal, faite **>join [nom du salon]**');
				} else {
					if(args[1]){
             if(args[1].charAt(0) == 'h' && args[1].charAt(1) == 't' && args[1].charAt(2) == 't' && args[1].charAt(3)){
                var id = ytid(args[1]);
               
                ytinfo(id, function (err, videoInfo) {
                  if (err) throw new Error(err);
                  var info = { link: videoInfo.url, title: videoInfo.title, owner: videoInfo.owner, duration: videoInfo.duration, date: videoInfo.datePublished, thumbnail : videoInfo.thumbnailUrl};
                  file.push(info);
                  if(!music){
                    start(file[0]);
                  } else {
                    if(playlist){
                      message.channel.send("La musique a été ajouté à la file d'attente");
                    }
                  }
                   return true;
              });
              } else {
              var options = {
                maxResults: 1,
                key: 'AIzaSyCMytiWESKX-N-LKaFEx6wjM5fZP1Lyx38'
              };
              args.shift();
              var words = args.join(' ');
              ytsearch(words, options, function(err, results) {
                if(err) return console.log(err);
                var videoInfo = results[0];
                var info = { link: videoInfo.link, title: videoInfo.title, owner: videoInfo.channelTitle, duration: 'Inconnue', date: videoInfo.publishedAt, thumbnail : videoInfo.thumbnails.medium.url};
                file.push(info);
                if(!music){
                  start(file[0]);
                } else {
                  if(playlist){
                    message.channel.send("La musique a été ajouté à la file d'attente");
                  }
                }
                return true;
              });
            }
          } else {
            message.channel.send("Le lien est manquant");
          }
        }
    }
    function generateOutputFile(channel, member) {
      // use IDs instead of username cause some people have stupid emojis in their name
      const fileName = `./recordings/${channel.id}-${member.id}-${Date.now()}.pcm`;
      return fs.createWriteStream(fileName);
    }
  if(message.content == ':matteo:'){
    message.edit('Le GIF pour bientôt ;)');
  }
  var args = message.content.split(' ');
	if(args[0].charAt(0) == '>'){
		args[0] = args[0].slice(1);
		switch(args[0]){
			case 'join':
				if(args[1] == undefined){
          if(message.member.voiceChannel !== undefined){
					  message.member.voiceChannel.join()
						  .then(function (connection) {
						  message.channel.send('Connexion au salon **' + connection.channel.name +'**');
              const receiver = connection.createReceiver();
              channel = connection.channel.name;
              /*connection.on('speaking', function (user, speaking) {
                console.log(speaking);
                if (speaking) {
                  console.log('Oh eh');
                  message.channel.send("I'm listening to ${user}");
                  // this creates a 16-bit signed PCM, stereo 48KHz PCM stream.
                  const audioStream = receiver.createPCMStream(user);
                  // create an output stream so we can dump our data in a file
                  const outputStream = generateOutputFile(message.member.voiceChannel, user);
                  // pipe our audio data into the file stream
                  audioStream.pipe(outputStream);
                  outputStream.on("data", console.log);
                  // when the stream ends (the user stopped talking) tell the user
                  audioStream.on('end', () => {
                    message.channel.sendMessage(`I'm no longer listening to ${user}`);
                  });
                }
						  });*/
            })
						.catch(console.error);
          } else {
            message.channel.send("Veuiller préciser le nom d'un salon vocal ou vous connecter a un salon vocal");
          }
				} else {
					args.shift();
					channel = args.join(' ');
					let voiceChannel = message.guild.channels
						.filter(function (channel) { return  channel.type === 'voice'; })
						.filter(function (name) { return  name.name === channel; })
						.first();
					if(voiceChannel == undefined){
						message.channel.send('Salon invalide');
					} else{
					voiceChannel.join()
						.then(function (connection) {
						  message.channel.send('Connexion au salon **' + connection.channel.name +'**');
              channel = connection.channel.name;
              const receiver = connection.createReceiver();
              /*connection.on('speaking', function (user, speaking) {
                console.log(speaking);
                if (speaking) {
                  console.log('Oh eh');
                  message.channel.send("I'm listening to ${user}");
                  // this creates a 16-bit signed PCM, stereo 48KHz PCM stream.
                  const audioStream = receiver.createPCMStream(user);
                  // create an output stream so we can dump our data in a file
                  const outputStream = generateOutputFile(voiceChannel, user);
                  // pipe our audio data into the file stream
                  audioStream.pipe(outputStream);
                  outputStream.on("data", console.log);
                  // when the stream ends (the user stopped talking) tell the user
                  audioStream.on('end', () => {
                    message.channel.sendMessage(`I'm no longer listening to ${user}`);
                  });
                }
						  });*/
            })
						.catch(console.error);
					}
        }
				break;
			case 'play':
				play(args, true);
				break;
      case 'pause':
				if(music){
          bot.voiceConnections.first().dispatcher.pause();
					message.channel.send('⏸ Lecture en pause');
				} else {
					message.channel.send("Aucune lecture en cours");
				}
			case 'resume':
				if(music){
          bot.voiceConnections.first().dispatcher.resume();
					message.channel.send('▶ Reprise de la lecture en cours');
				} else {
					message.channel.send("Aucune lecture en cours");
				}
				break;
      case 'stop':
				if(music){
          bot.voiceConnections.first().dispatcher.end();
					message.channel.send('⏹ Arret de la lecture en cours');
				} else {
					message.channel.send("Aucune lecture en cours");
				}
				break;
			case 'disconnect':
        if(bot.voiceConnections.first() !== undefined){
				bot.voiceConnections.first().disconnect();
				message.channel.send('Deconnexion du salon vocal **' + channel + '**');
        } else {
          message.channel.send("Le bot n'est pas connecté à un serveur vocal");
        }
				break;
			case 'volume':
				volume = args[1];
				message.channel.send('Volume réglé sur **' + args[1] + '**');
				break;
      case 'loop':
        if(loop){
          loop = false;
          message.channel.send('🔄 Lecture en boucle desactivé');
        } else {
          loop = true;
          message.channel.send('🔄 Lecture en boucle activé');

        }
        break;
      case 'file':
				if(file !== undefined){
          var i = 1
          message.channel.send("**File d'attente**");
          console.log(file[i]);
          while (i < file.length){
            if(file[i] !== undefined){
            message.channel.send(new Discord.RichEmbed() 
              .setTitle('Position '+ i)
              .addField("Nom de la musique", file[i].title)
              .addField("Auteur", file[i].owner)
              .addField("Durée", file[i].duration)
              .addField("Date de publication", file[i].date)
              .setImage(file[i].thumbnail)
            )
            i++;
            } else {
              message.channel.send('Vide');
            }
          }
				} else {
					message.channel.send("Aucune musique est dans la file");
				}
        break;
       case 'next':
				if(file !== undefined){
          bot.voiceConnections.first().dispatcher.end();
          message.channel.send("Passage à la musique suivante");
				} else {
					message.channel.send("Aucune musique est dans la file");
				}
        break;
      case 'clear':
        if(file !== []){
          file.splice(0, file.length);
          message.channel.send("La file d'attente a été vidée")
        } else {
          message.channel.send("La file d'attente est déjà vide")
        }
        break;
      case 'delete':
				if(message.channel.name == 'commandesbot' || message.channel.name == 'radio-musique'){
          message.channel.bulkDelete(100)
            .then(deleted => message.channel.send('ℹ Tous les messages du salon **'+ message.channel.name +'** ont été supprimé, soit '+ deleted.size +' messages.'))
            .catch(console.error);
				} else {
					message.channel.send("Vous ne pouvez pas supprimer les messages de ce salon.");
				}
        break;
			case 'profile':
        if(message.member.roles.exists('name', 'Fondateur') || message.member.roles.exists('name', 'Technicien') || message.member.roles.exists('name', 'Administrateur')){
				if(args[1]){
          args.shift();
					var memberTest = message.guild.members
						.filter(function (members) { return  members.user.username == args.join(' ')})
						.first();
						
					var lastMessage  = '';
          var voiceChannel = '';
					if (memberTest.lastMessage) {
						lastMessage = memberTest.lastMessage.content;
					} else {
						lastMessage = 'Illisible';
					}
          if(memberTest.voiceChannel){
            voiceChannel = memberTest.voiceChannel.name
          } else {
            voiceChannel = 'Non connecté'
          }
					message.channel.sendEmbed(new Discord.RichEmbed()
						.setTitle("**Profil de " + memberTest.user.username +"**")
						.setThumbnail(memberTest.user.avatarURL)
            .addField("Id :", memberTest.id)
            .addField("Tag :", memberTest.user.tag)
            .addField("Roles :", memberTest.roles.array())
						.addField("Statut :", memberTest.presence.status)
            .addField("Connexion a un salon vocal :", voiceChannel)
						.addField("Compte créée le :", memberTest.user.createdAt)
						.addField("Rejoins LouwixGame le :", memberTest.joinedAt)
						.addField("Dernier message :", lastMessage)
					  .setColor(memberTest.displayColor)
					);
          
				} else {
					message.channel.send("Le pseudo est manquant");
				}
        }
				break;
			case 'help':
				if(args[1]){
					switch(args[1]){
						case 'music':
							message.channel.sendEmbed(new Discord.RichEmbed()
								.addField(">join [VoiceChannel]", "Le bot rejoins le salon vocal dans lequel vous êtes si aucun nom de salon vocal n'est précisé, sinon il rejoins le salon que vous avez saisi.")
								.addField("!play [Url, Mots clés]", "Le bot vas jouer dans le salon vocal dans lequel il se trouve,  la musique du lien **Youtube** ou les mots clés saisis")
								.addField(">pause", "La lecture de la musique actuelle sera mis en pause.")
								.addField(">resume", "La lecture actuelle précédement mise en pause sera reprise.")
								.addField(">disconnect", "Le bot vas quitter le salon vocal dans lequel il se trouve.")
                .addField(">stop", "Arrete la musique en cours de lecture.")
                .addField(">file", "Affiche les musiques en file d'attente.")
                .addField(">next", "Passe a la prochaine musique de la file d'attente.")
								.setColor('GREEN')
							);
							break;
						case 'staff':
							message.channel.sendEmbed(new Discord.RichEmbed()
								.addField(">profile [Pseudo]", "Quelques informations vous seront donné sur le pseudo saisi.")
							);
              break;
            case 'playlist':
              message.channel.sendEmbed(new Discord.RichEmbed()
                .addField(">playlist create [Nom] [Url]", "Créer une playlist portant le nom du premier paramètre, vous pouvez ensuite ajouter autant de liens Youtube que vous voulez tant que vous séparez bien les lien par un espace.")
                .addField(">playlist load [Nom]", "Lecture d'une playlist préalablement enregistrée.")
              );
              break;
					}
				} else {
					var embed = new Discord.RichEmbed()
						.addField("Aides sur les commandes musicales :", ">help music")
						.addField("Aides sur les commandes de modération :", ">help staff")
            .addField("Aides sur les commandes de playlist : ", ">help playlist")
						.setFooter("LouwixBot est une création de Louwix pour LouwixGame. Copyright 2017-2018, tous droit réservé.")
						.setColor('GREEN')
					message.channel.sendEmbed(embed);
				}
				break;
      case 'playlist':
        if(args[1] == 'create'){
          message.channel.send('En développement :)');
          if(args[2] !== undefined){
            if(args[3] !== undefined){
              fs.readFile('./playlist.json', function(err, data) {
              var playlist = JSON.parse(data);
              console.log();
              var list = args.slice(3)
              console.log(list);
              playlist.push({ name: args[2], playlist: list});
              fs.writeFile('./playlist.json', JSON.stringify(playlist));   
              message.channel.send("Playlist " + args[2] + " créée.");
              });
            } else {
              message.channel.send('Préciser au minimum un url')
            }
          } else {
            message.channel.send('Préciser un nom de playlist');
          }
        }
        else if(args[1] == 'load'){
          if(args[2] !== undefined){
            var i = 0;
            var check = false;
            var playlistcheck = {}
            var playlist = JSON.parse(data);
            while (!check){
              if(playlist[i].name == args[2]){
                playlistcheck = playlist[i].playlist;
                var i2 = 0;
                while(i2 < playlistcheck.length){
                  var array = [''];
                  array.push(playlistcheck[i2]);
                  console.log(array);
                  delay = setTimeout(play, i2*1000, array, false)
                  i2++;
                }
                check = true;
                message.channel.send("La playlist est chargée, pour consulter les musiques qu'elle contient faite >file")
              }
              i++;
            }
          } else {
            message.channel.send("Préciser le nom d'une playlist enregistrée");
          }
        } 
        else {
          message.channel.send('Préciser ">playlist create" ou ">playlist load".');
        }
        break;
      case 'code':
        var lang = args[1];
        args = args.slice(2);
        var content = args.join(' ');
        console.log(content);
        message.delete();
        message.channel.sendCode(lang, content);
        break;
      case 'cours':
        Cours.js();
        break;
			default:
				message.channel.send('Commande inconnue, faites >help');
				break;
		}
	}
}
}