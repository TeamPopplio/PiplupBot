var func = require("../data/functions.js"),
    discord = require("discord.js");
var data = require("../data/guild-data.json")
exports.action = (message, args) => {
    let pool
    var n = 2
    if(args[0].toLowerCase() == "normal")
    {
        if(!func.isAllowed(message,"mods")) pool = "``"+message.author.tag+":`` "  // Admins will not have the "User:" prefix
        return message.channel.send(pool + args.slice(1).join(" "))
            .then(msg => {
                console.log(message.author.tag+' says "'+args.slice(1).join(" ")+'" in '+message.guild.name+", #"+message.channel.name)
                message.delete()
            })
    }
    else if(!func.isAllowed(message,"mods")) pool = message.author.tag+" sent this message." // For use as a footer in embeds.
	embed = new discord.MessageEmbed()
    if(args[0].startsWith("color:"))
    {
        embed.setColor(args[0].replace("color:","").toUpperCase())
        args = args.slice(1)
    }
    if(args[0].startsWith("n:"))
    {
        n = parseInt(args[0].replace("n:",""))
        args = args.slice(1)
    }
    if(args[0].startsWith("title:"))
    {
        embed.setTitle(args[0].replace("title:","") + " " + args.slice(1,n).join(" "))
        args = args.slice(n)
    }
    embed.setDescription(args.join(" "))
	if(pool != "")
	{
	    embed.setFooter(pool,message.author.avatarURL({format:"png",size:128}))
	
    }
    
    message.channel.send("",{embed:embed}).then(msg => {
        console.log(message.author.tag+' says:\n    "'+embed.title+'"\n    "'+embed.description+'"\nin #'+message.channel.name+", "+message.guild.name)
        message.delete()
    })
}