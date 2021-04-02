module.exports = {
	name: 'demote',
	description: 'demotion command',
	execute(message,username,Reason,client,GroupID) {
        const nbx = require('noblox.js');
        const User = message.author

        var currentDateAndTime = new Date().toLocaleString();

        async function exec() {
            const userId = await nbx.getIdFromUsername(username).catch(e => "UNF"); 

            if (userId == 'UNF') {
                message.channel.send({
                    embed: {
                        "color": 3092790,
                        "title": "Demotion Failed",
                        "description": "Player does not exist in ROBLOX database, please try again."
                    }
                })
            } else if (userId !== 'UNF') {
                const channel = client.channels.cache.get('771439478661185577');
                const PlayerName = await nbx.getUsernameFromId(userId)
                const demote = await nbx.changeRank(GroupID, userId,-1).catch(e => "UNF"); 

                if (demote !== "UNF") {
                    const PriorRank = demote.oldRole.name
                    const NewRank = demote.newRole.name               
                    channel.send({                   
                        embed: {                      
                            "color": 3092790,                       
                            "title": "Demoted Player",                        
                            "description": "**Username:** "+PlayerName+"\n**Prior Rank:** "+PriorRank+"\n**New Rank:** "+NewRank+"\n**Reason:** "+Reason+"\n**Date:** "+currentDateAndTime+"",                        
                            "thumbnail": {                            
                                "url": "https://www.roblox.com/bust-thumbnail/image?userId="+userId+"&width=420&height=420&format=png",
                            }        
                        }
                    })
                } else if (demote == "UNF") {
                    return message.channel.send({
                        embed: {
                            "color": 3092790,
                            "title": "Demoted failed",
                            "description": "Player isn't in the group. Are you sure you typed out the username correctly? Please try again."
                        }
                    })
                }
            }
        }
        exec()
    }
}