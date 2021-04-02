  
module.exports = {
	name: 'rankup',
	description: 'Rank up command',
	execute(message, firebase, client,GroupID) {
        const nbx = require('noblox.js');
        const User = message.author

        var currentDateAndTime = new Date().toLocaleString();

        var ref = firebase.database().ref("Verifications/Discord/")
            ref.once("value")
            .then(function(snapshot) {
            var isVerified = snapshot.child(User.id).hasChildren()   

            if (isVerified == false) {
                User.send({
                    embed: {
                        "color": 3092790,
                        "title": "Rank up failed",
                        "description": "We couldn't recognize you. Please run !verify again in #verification to reverify.",
                    }
                })
            }

            if (isVerified == true) {
                
                var ref1 = firebase.database().ref("Verifications/Discord/"+User.id+"/UserID")
                ref1.once("value", function(snapshot) {

                    async function exec(UserID) {
                        const GetPlayerRank = await nbx.getRankNameInGroup(GroupID, UserID)
                         
                        if (GetPlayerRank == "Volunteer") {
                            nbx.setRank({ group: GroupID, target: UserID, rank: 232 })
                            .then 
                            const PlayerName = await nbx.getUsernameFromId(UserID)
                            const channel = client.channels.cache.get('771439478661185577');
                            User.send({
                                embed: {
                                    "color": 3092790,
                                    "title": "Rank up successful",
                                    "description": "You have been promoted to Private."
                                }
                            })
                            channel.send({
                                embed: {
                                    "color": 3092790,
                                    "title": "Promoted Player",
                                    "description": "**Username:** "+PlayerName+"\n**Prior Rank:** Volunteer\n**New Rank:** Private\n**Reason:** Rank up\n**Date:** "+currentDateAndTime+"",
                                    "thumbnail": {
                                        "url": "https://www.roblox.com/bust-thumbnail/image?userId="+UserID+"&width=420&height=420&format=png",
                                    }
                                }
                            })
                        } else {
                            User.send({
                                embed: {
                                    "color": 3092790,
                                    "title": "Rankup failed",
                                    "description": "You have already been ranked up. Only volunteers are eligible to rank up."
                                }
                            })
                        }
                    }

                    exec(snapshot.val())
                })
            }
        })
    }
}