module.exports = {
	name: 'getrole',
	description: 'getrole command',
	execute(message,client,firebase,database,GroupID) {
        console.log("hey")
        
        const nbx = require('noblox.js');

        const Channel = message.channel
        const User = message.author
        const Member = message.member

        var currentDateAndTime = new Date().toLocaleString();

        var ref = firebase.database().ref("Verifications/Discord/")
            ref.once("value")
            .then(function(snapshot) {
            var isVerified = snapshot.child(User.id).hasChildren()   

            if (isVerified == false) {
                Channel.send({
                    embed: {
                        "color": 3092790,
                        "title": "Rank up failed",
                        "description": "We couldn't recognize you. Please run !verify again in #verification to reverify.",
                    }
                })
            } else if (isVerified == true) {

                var RefUserID = firebase.database().ref("Verifications/Discord/"+User.id+"/UserID")
                var RefCurrentRank = firebase.database().ref("Verifications/Discord/"+User.id+"/Current Rank")

                RefUserID.once("value", function(snapshot) {
                    var UserID = snapshot.val()

                    RefCurrentRank.once("value", function(snapshot) {
                        var CurrentRank = snapshot.val()

                        async function exec() {
                            const GetPlayerRank = await nbx.getRankNameInGroup(GroupID, UserID)
                            const GetPlayerUsername = await nbx.getUsernameFromId(UserID)

                            const GetGroupRanks = await nbx.getRoles(GroupID).map(r=> r.name)

                            let CheckGuildRole = message.guild.roles.cache.find(r => r.name === GetPlayerRank)

                            if (!CheckGuildRole) { // -- Checks if server has player group rank
                                return Channel.send({
                                    embed: {
                                        "color": 3092790, 
                                        "title": GetPlayerUsername,
                                        "description": "We couldn't find any missing roles. Please try again when you get promoted or demoted.",
                                        "thumbnail": {
                                            "url": "https://www.roblox.com/bust-thumbnail/image?userId=%22+UserID+%22&width=420&height=420&format=png",
                                        }
                                    }
                                })                                
                            }

                            var UserRoles = message.member.roles.cache.map(r=> r.name)

                            FilterPlayerRank = GetGroupRanks.filter(f => !GetPlayerRank.includes(f))

                            FilterMemberRoles = UserRoles.filter(f => !FilterPlayerRank.includes(f))

                            FilterUserServerRoles = UserRoles.filter(f => GetGroupRanks.includes(f))
                            RemoveRoles = FilterUserServerRoles.filter(f => !GetPlayerRank.includes(f))

                            let ServerRolesCheck = message.guild.roles.cache.find(r => r.name === RemoveRoles)
                                                    
                            var GetRemovedRolesID = Array()
                             
                            for(let i = 0;i < RemoveRoles.length;i++){
                                let role = message.guild.roles.cache.find(r => r.name === RemoveRoles[i]).id;
                                GetRemovedRolesID.push(role);
                                
                             }

                            let CheckMemberRoles = Member.roles.cache.some(r => r.name === GetPlayerRank) // Checks if user has role from group ranks. Returns true or false

                            if (CheckMemberRoles) {
                                if (Member.roles.cache.some(r => FilterPlayerRank.includes(r.name))) {         
                                    Member.roles.remove(GetRemovedRolesID).then    
                                    return Channel.send({
                                        embed: {
                                            "color": 3092790,
                                            "title": "Roles Updated",
                                            "thumbnail": {
                                                "url": "https://www.roblox.com/bust-thumbnail/image?userId="+UserID+"&width=420&height=420&format=png",
                                            },
                                            "fields": [
                                                {
                                                    "name": "Username:",
                                                    "value": GetPlayerUsername,
                                                },
                                                {
                                                    "name": "Roles Removed:",
                                                    "value": RemoveRoles,
                                                },
                                              ]
                                          }
                                    })              
                                   }  else {
                                    return Channel.send({
                                        embed: {
                                            "color": 3092790, 
                                            "title": GetPlayerUsername,
                                            "description": "We couldn't find any missing roles. Please try again later.",
                                            "thumbnail": {
                                                "url": "https://www.roblox.com/bust-thumbnail/image?userId=%22+UserID+%22&width=420&height=420&format=png",
                                            }
                                        }
                                    })
                                   }                             
                                } 
                                else {
                                    const GetGroupRankRole = message.guild.roles.cache.find(r => r.name === GetPlayerRank)

                                    if (Member.roles.cache.some(r => FilterPlayerRank.includes(r.name))) {
                                        Member.roles.remove(GetRemovedRolesID).then  
                                        Member.roles.add(GetGroupRankRole).then                               
                                        return Channel.send({
                                            embed: {
                                                "color": 3092790,
                                                "title": "Roles Updated",
                                                "thumbnail": {
                                                    "url": "https://www.roblox.com/bust-thumbnail/image?userId="+UserID+"&width=420&height=420&format=png",
                                                },
                                                "fields": [
                                                    {
                                                        "name": "Username:",
                                                        "value": GetPlayerUsername,
                                                    },
                                                    {
                                                        "name": "Roles Added:",
                                                        "value": GetPlayerRank,
                                                    },
                                                    {
                                                        "name": "Roles Removed:",
                                                        "value": RemoveRoles,
                                                    },
                                                  ]
                                              }
                                        })

                                    } else {
                                        Member.roles.add(GetGroupRankRole).then
                                        return Channel.send({
                                            embed: {
                                                "color": 3092790,
                                                "title": "Roles Updated",
                                                "thumbnail": {
                                                    "url": "https://www.roblox.com/bust-thumbnail/image?userId="+UserID+"&width=420&height=420&format=png",
                                                },
                                                "fields": [
                                                    {
                                                        "name": "Username:",
                                                        "value": GetPlayerUsername,
                                                    },
                                                    {
                                                        "name": "Roles Added:",
                                                        "value": GetPlayerRank,
                                                    },
                                                  ]
                                              }
                                        })
                                    }
                                }                 
                            }
                        exec()
                    })
                })
            }
        })
    }
}