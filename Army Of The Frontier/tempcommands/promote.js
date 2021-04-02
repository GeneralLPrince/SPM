module.exports = {
	name: 'promote',
	description: 'promote command',
	execute(message,username,Reason,client,GroupID) {
        const nbx = require('noblox.js');
        const User = message.author

        var currentDateAndTime = new Date().toLocaleString();

        async function exec() {

            const Member  = message.member

            var CanPromote = Array()

            if (!Member.roles.cache.some(r => ["First Sergeant","Ordnance Sergeant","Quartermaster Sergeant","Sergeant Major","Sergeant Major of the Army","First Lieutenant","Captain","Major","Lieutenant Colonel","Colonel","Brigadier General","Major General","Lieutenant General","Lieutenant Governor","Governor","Secretary of War"].includes(r.name))) {
                return message.channel.send({
                    embed: {
                        "color": 3092790,
                        "title": "Promotion failed",
                        "description": "You do not have permission to promote this player."
                    }
                })
            }

            if (!username) {
                return message.channel.send("You forgot the username, please use this format: !promote [Username] [Reason]")
            }

            if (!Reason) {
                return message.channel.send("You forgot the reason, please use this format: !promote [Username] [Reason]")
            }

            if (Member.roles.cache.some(r => ["First Sergeant","Ordnance Sergeant","Quartermaster Sergeant"].includes(r.name))) {
                CanPromote.push("Private","Private First Class")
            }

            if (Member.roles.cache.some(r => ["Sergeant Major","First Lieutenant","Captain"].includes(r.name))) {
                CanPromote.push("Private","Private First Class","Corporal","Sergeant","First Sergeant","Ordnance Sergeant")
            }

            if (Member.roles.cache.some(r => r.name === "Sergeant Major of the Army")) {
                CanPromote.push("Private","Private First Class","Corporal","Sergeant","First Sergeant","Ordnance Sergeant","Quartermaster Sergeant")
            }

            if (Member.roles.cache.some(r => r.name === "Major")) {
                CanPromote.push("Private","Private First Class","Corporal","Sergeant","First Sergeant","Ordnance Sergeant","Quartermaster Sergeant","Sergeant Major","Sergeant Major of the Army","Adjutant","Second Lieutenant","First Lieutenant")
            }

            if (Member.roles.cache.some(r => r.name === "Lieutenant Colonel")) {
                CanPromote.push("Private","Private First Class","Corporal","Sergeant","First Sergeant","Ordnance Sergeant","Quartermaster Sergeant","Sergeant Major","Sergeant Major of the Army","Adjutant","Second Lieutenant","First Lieutenant","Captain")
            }

            if (Member.roles.cache.some(r => r.name === "Colonel")) {
                CanPromote.push("Private","Private First Class","Corporal","Sergeant","First Sergeant","Ordnance Sergeant","Quartermaster Sergeant","Sergeant Major","Sergeant Major of the Army","Adjutant","Second Lieutenant","First Lieutenant","Captain","Major")
            }
       
            if (Member.roles.cache.some(r => r.name === "Brigadier General")) {
                CanPromote.push("Private","Private First Class","Corporal","Sergeant","First Sergeant","Ordnance Sergeant","Quartermaster Sergeant","Sergeant Major","Sergeant Major of the Army","Adjutant","Second Lieutenant","First Lieutenant","Captain","Major","Lieutenant Colonel")
            }

            if (Member.roles.cache.some(r => r.name === "Major General")) {
                CanPromote.push("Private","Private First Class","Corporal","Sergeant","First Sergeant","Ordnance Sergeant","Quartermaster Sergeant","Sergeant Major","Sergeant Major of the Army","Adjutant","Second Lieutenant","First Lieutenant","Captain","Major","Lieutenant Colonel","Colonel")
            }

            if (Member.roles.cache.some(r => r.name === "Lieutenant General")) {
                CanPromote.push("Private","Private First Class","Corporal","Sergeant","First Sergeant","Ordnance Sergeant","Quartermaster Sergeant","Sergeant Major","Sergeant Major of the Army","Adjutant","Second Lieutenant","First Lieutenant","Captain","Major","Lieutenant Colonel","Colonel","Brigadier General")
            }

            if (Member.roles.cache.some(r => r.name === "Lieutenant Governor")) {
                CanPromote.push("Private","Private First Class","Corporal","Sergeant","First Sergeant","Ordnance Sergeant","Quartermaster Sergeant","Sergeant Major","Sergeant Major of the Army","Adjutant")
            }

            if (Member.roles.cache.some(r => r.name === "Secretary of War")) {
                CanPromote.push("Private","Private First Class","Corporal","Sergeant","First Sergeant","Ordnance Sergeant","Quartermaster Sergeant","Sergeant Major","Sergeant Major of the Army","Adjutant","Second Lieutenant","First Lieutenant","Captain","Major","Lieutenant Colonel","Colonel","Brigadier General")
            } 
            const userId = await nbx.getIdFromUsername(username).catch(e => "UNF");
            const GetUserRank = await nbx.getRankNameInGroup(GroupID, userId)

            if (userId == 'UNF') {
                message.channel.send({
                    embed: {
                        "color": 3092790,
                        "title": "Promotion Failed",
                        "description": "Player does not exist in ROBLOX database, please try again."
                    }
                })
            } else if (userId !== 'UNF') {
                const channel = client.channels.cache.get('777126854049136660');
                const PlayerName = await nbx.getUsernameFromId(userId)
                    if (GetUserRank === 'Sergeant Major') {                    
                        const promote = await nbx.setRank(GroupID, userId, 241).catch(e => "UNF"); 
                        if (promote !== "UNF") {
                            const PriorRank = "Sergeant Major"
                            const NewRank = "Adjutant"             
                            return channel.send({                   
                                embed: {                      
                                    "color": 3092790,                       
                                    "title": "Promoted Player",                        
                                    "description": "**Username:** "+PlayerName+"\n**Prior Rank:** "+PriorRank+"\n**New Rank:** "+NewRank+"\n**Reason:** "+Reason+"\n**Date:** "+currentDateAndTime+"",                        
                                    "thumbnail": {                            
                                        "url": "https://www.roblox.com/bust-thumbnail/image?userId="+userId+"&width=420&height=420&format=png",
                                    }        
                                }
                            })

                        } else if (promote == "UNF") {
                            return message.channel.send({
                                embed: {
                                    "color": 3092790,
                                    "title": "Promotion failed",
                                    "description": "Player isn't in the group. Are you sure you typed out the username correctly? Please try again."
                                }
                            })
                        }                          
                    }

                const promote = await nbx.promote(GroupID, userId).catch(e => "UNF"); 
                if (promote !== "UNF") {

                    const PriorRank = promote.oldRole.name
                    const NewRank = promote.newRole.name               
                    channel.send({                   
                        embed: {                      
                            "color": 3092790,                       
                            "title": "Promoted Player",                        
                            "description": "**Username:** "+PlayerName+"\n**Prior Rank:** "+PriorRank+"\n**New Rank:** "+NewRank+"\n**Reason:** "+Reason+"\n**Date:** "+currentDateAndTime+"",                        
                            "thumbnail": {                            
                                "url": "https://www.roblox.com/bust-thumbnail/image?userId="+userId+"&width=420&height=420&format=png",
                            }        
                        }
                    })
                } else if (promote == "UNF") {
                    return message.channel.send({
                        embed: {
                            "color": 3092790,
                            "title": "Promotion failed",
                            "description": "Player isn't in the group. Are you sure you typed out the username correctly? Please try again."
                        }
                    })
                }
            }
        }
        exec()
    }
}