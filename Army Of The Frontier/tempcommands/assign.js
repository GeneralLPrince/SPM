const { User } = require("discord.js")

module.exports = {
	name: 'assign',
	description: 'assignment command',
	execute(message,args,nbx,firebase,database,client) {
		const Username = args[0]
		var Garrison = args.slice(1).join(" ")
		const Channel = message.channel

		if (!Username) {
			return Channel.send("You forgot the username, please use this format: !assign [Username] [Regiment/Garrison]")
		}

		if (!Garrison) {
			return Channel.send("You forgot the Regiment/Garrison name, please use this format: !assign [Username] [Regiment/Garrison]")
		}

		Garrison = Garrison.replace("st", 'ˢᵗ')
		Garrison = Garrison.replace("rd", 'ʳᵈ')
		Garrison = Garrison.replace("nd", 'ⁿᵈ')
		Garrison = Garrison.replace("th", 'ᵗʰ')

		async function exec() {			
			const UserId = await nbx.getIdFromUsername(Username).catch(e => "UDE")

			if (UserId === "UDE") {
				return Channel.send({
					embed: {
					  "type": "rich",
					  "color": 3092790,
					  "title": "Assignment Failed",
					  "description": "We couldn't find the user on ROBLOX database, are you sure you wrote the username correctly? Please try again.",
					}
				})
			}

			var RefCheckIfVerified = firebase.database().ref("Verifications/Roblox/")				   
			RefCheckIfVerified.once("value", function(snapshot) {
				var isVerified = snapshot.child(UserId).hasChildren()
				if (isVerified == false) {
					return Channel.send({
						embed: {
							"color": 3092790,
							"title": "Assignment Failed",
							"description": "The user isn't verified. Please tell them to run !verinfy in #verification to verify.",
						}
					})
				} else
				if (isVerified == true) {
					var GetUserDiscordID = firebase.database().ref("Verifications/Roblox/"+UserId+"/DiscordID")				
					GetUserDiscordID.once("value", function(snapshot) {
						const MemberID = snapshot.val()
						const IsInGuild = Channel.guild.members.fetch(MemberID).catch(e => "MIN")

						if (IsInGuild == "MIN") {
							return Channel.send({
								embed: {
									"color": 3092790,
									"title": "Assignment Failed",
									"description": "We couldn't find the user, please tell them to join the server.",
								}
							})
						}

						if (IsInGuild !== "MIN") {
							let CheckGuildRole = message.guild.roles.cache.find(r => r.name === Garrison)
							if (CheckGuildRole) {

								var CurrentGarrisons = (['AMP | Officer Staff','AMP | Mounted Police', 'Army Military Police','1ˢᵗ | Officer Staff','1ˢᵗ | Howitzer Battery', '1ˢᵗ Volunteer Artillery','2ⁿᵈ | Officer Staff','2ⁿᵈ | Sharps Platoon','2ⁿᵈ Volunteer Rifles','3ʳᵈ | Officer Staff','3ʳᵈ | Grenadier Company','3ʳᵈ Volunteer Infantry','7ᵗʰ | Officer Staff','7ᵗʰ | Chasseur Companie','7ᵗʰ Volunteer Infantry','9ᵗʰ | Officer Staff','9ᵗʰ | Grenadier Company','9ᵗʰ Volunteer Infantry','11ᵗʰ | Life Guard Company','11ᵗʰ Federal Guards','23ʳᵈ | Cavalry Staff','23ʳᵈ | Dragoon Platoon','23ʳᵈ Volunteer Cavalry']);
								Array.from(CurrentGarrisons);

								var UserRoles = message.member.roles.cache.map(r=> r.name)

						    	let ServerRolesCheck = message.guild.roles.cache.map(r => r.name)

								FilterServerRolesFromGarrisons = ServerRolesCheck.filter(f => !CurrentGarrisons.includes(f))

								FilterUserServerRoles = UserRoles.filter(f => !FilterServerRolesFromGarrisons.includes(f))

								RemoveRoles = FilterUserServerRoles.filter(f => !Garrison.includes(f))

								FilterGarrionRoles = ServerRolesCheck.filter(f => !FilterServerRolesFromGarrisons.includes(f))

								console.log(RemoveRoles)

								var GarrisonRoles = Array()

								for(let i = 0;i < FilterGarrionRoles.length;i++){
									let role = message.guild.roles.cache.find(r => r.name === FilterGarrionRoles[i]).id;
									GarrisonRoles.push(role);
								}

							} else message.channel.send("role doesn't exist")
						}
					})
				}
			})
		}

		exec()
    }    
}