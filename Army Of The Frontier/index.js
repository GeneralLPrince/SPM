  
const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const nbx = require('noblox.js');

const prefix = ';'

const GroupID = '8365661'
const ChannelID = '824382585420644402'

var cron = require("cron");

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

var config = {
    apiKey: 'AAAAwSfQmxg:APA91bHbRMjcsLrXIIj3m3rmqR6nvp0mUkC0-_OaPsHGl2AngFsFIB2BvBIGqmWceqMpWEuVgQPx5xfhc9o_1x1Z8UATA8DKy9VRpi88RtGsjKqhp_eeT1sl_X1KXG7iN3phXOMsLbH_',
    authDomain: 'crossroads-of-freedom.firebaseapp.com',
    databaseURL: 'https://crossroads-of-freedom-53aa1.firebaseio.com',
    storageBucket: "bucket.appspot.com"
  }

  var firebase = require('firebase')

  firebase.initializeApp(config);
  var database = firebase.database();

function Login() {
    async function SetCookie(cookie) { 
        const setcookie = await nbx.setCookie(String(cookie)).catch(e => "Invalid")  
        
        if (setcookie == "Invalid") {
            return LoggingChannel.send({embed: {"color": 3092790,"title": "cookie expired","description": "dude give me a new cookie i am hungry or else no !promote, !demote and !rankup command for you. dm generallprince for help"}})
        }

        if (setcookie !== "Invalid") {
            return LoggingChannel.send({embed: {"color": 3092790,"title": "tasty cookie","description": "thanks for the cookie, logged in COFManager"}})
        }
    } 

    var ref = firebase.database().ref("Verifications/Cookie")          
    ref.once("value")           
    .then(function(snapshot) {                           
        const Cookie = snapshot.val()          
        SetCookie(Cookie)
    })
}


function test() { 
    const Channel1 = client.channels.cache.get('818979766706896916')
    Channel1.send("minute")
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({ activity: { name: "with jacquey and general balls" }, status: 'online' });
  let job1 = new cron.CronJob('59 23 * * * *', test);
  job1.start()
  const LoggingChannel = client.channels.cache.get('818979766706896916')
  LoggingChannel.send("Timer started")
});


client.on("guildMemberAdd", (User) => { 
    var DiscordRef = database.ref("Verifications/Discord/")  
    
    DiscordRef.once("value").then(function(snapshot) {
        var isVerified = snapshot.child(User.id).hasChildren()            

        if (isVerified == true) {
            var DiscordRobloxUserRef = firebase.database().ref("Verifications/Discord/"+User.id+"/UserID") 
            DiscordRobloxUserRef.once("value").then(function(snapshot) {
                var RobloxUserRef = database.ref("Verifications/Roblox/"+snapshot.val())
                var DiscordUserRef = database.ref("Verifications/Discord/"+User.id)
                
                RobloxUserRef.set({
                    DiscordID: User.id, 
                    InServer: true
                });                
                DiscordUserRef.set({   
                    UserID: snapshot.val(),
                    InServer: true
                 });
            })
        }
    })
});

  client.on("guildMemberRemove", (User) => { 
    var DiscordRef = database.ref("Verifications/Discord/")  
    
    DiscordRef.once("value").then(function(snapshot) {
        var isVerified = snapshot.child(User.id).hasChildren()            

        if (isVerified == true) {
            var DiscordRobloxUserRef = firebase.database().ref("Verifications/Discord/"+User.id+"/UserID") 
            DiscordRobloxUserRef.once("value").then(function(snapshot) {
                var RobloxUserRef = database.ref("Verifications/Roblox/"+snapshot.val())
                var DiscordUserRef = database.ref("Verifications/Discord/"+User.id)
                
                RobloxUserRef.set({
                    DiscordID: User.id, 
                    InServer: false
                })
                               
                DiscordUserRef.set({ 
                    InServer: false,  
                    UserID: snapshot.val()
                 });
            })
        }
    })
  });

process.on('unhandledRejection', error => {
    const Channel1 = client.channels.cache.get('818979766706896916')
    Channel1.send('Unhandled promise rejection:'+error)
});



client.on("message", message => {  

    if (message.content.indexOf(prefix) !== 0) {
        if (message.channel.id == ChannelID) {
            setTimeout(() => {
                message.delete()
            }, 120000)
        }
    }
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    var playerMessage = message.content
    const PlayerDM = message.author

    // Message filters
    var Mentions = message.mentions.members.first();

    if (Mentions) {
        if (message.author.bot) return;
        if(message.author.id == '393971364140154891') return;

        if (Mentions.id == '393971364140154891') {
            if (PlayerDM.id == '349295719200587786' || PlayerDM.id == '747654040019665026' || PlayerDM.id == '205464570548977666') return;
            var role = message.guild.roles.cache.find(r => r.name === "Muted")
            message.member.roles.add(role);
            setTimeout(() => {
                message.member.roles.remove(role)
              }, 300000);
        }
    }
    // Main Commands
    if (command == 'verify') {
        if (message.channel.id == ChannelID) {
            client.commands.get("verify").execute(message,firebase,client,nbx,Discord,PlayerDM,playerMessage,database)
        }       
    }

    if (command == 'change-user') {
        if (message.channel.id == ChannelID) {
            client.commands.get("changeuser").execute(message,firebase,client)
        }
    }
    
    if (command === 'ban') {
        const suspect = args[0]
        const reason = args.slice(1).join(" "); 
    
        if(!message.member.roles.cache.some(role => role.name === "Scripter")) {
          return message.channel.send("wannabe mod lol")
        }
    
        if (!suspect) {
          return message.channel.send("You forgot the username, please use this format: `!ban [Username][banReason]`")
        }
    
        if (!reason) {
          return message.channel.send("You forgot the ban reason, please use this format: `!ban [Username][banReason]`")
        }
        client.commands.get("ban").execute(suspect, reason, message, database)    
    }

    if (command === 'unban') {
        const suspect = args[0]
      
        if(!message.member.roles.cache.some(role => role.name === "Scripter")) {
          return message.channel.send("lmao wannabe mod")
        }
      
        if (!suspect) {
          return message.channel.send("You forgot the username, please use this format: `!unban [Username]`")
        }
        client.commands.get("unban").execute(suspect, message, firebase)
    }

    // Secondary commands
    if (command == '123412312131231245123') {
        message.channel.bulkDelete(100).then(() => {
             (msg => msg.delete(3000));
          });
    }

    if (command == 'aa') {
            message.channel.send({
                embed: {
                    "color": 3092790,
                    "title": "Bot Usage",
                    "description": "Welcome! If you would like to verify please say **'!verify'**. If you want to change your ROBLOX account then say **'!change-user'**",
                }
            })    
    }

    if (command == 'wj') {
        var mention = args[0]

        if (mention.startsWith('<@') && mention.endsWith('>')) {
                var mention = mention.slice(2, -1);
    
            if (mention.startsWith('!')) {
                var mention = mention.slice(1);
            }
        }

        const member = message.guild.member(mention)
        const whenjoined = String(member.joinedAt)
        message.channel.send(whenjoined)
    }
}) 

client.login('NzcwMzQ2MjU4NjEwNjUxMTU2.X5cO3A.p9EN3yXqGpvlwiznHXLwi3BwOho');