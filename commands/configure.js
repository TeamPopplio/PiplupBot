exports.description = "Configure settings for this guild."
// This command is currently unfinished and will be updated in the future.
var discord = require("discord.js"),
    func = require("../data/functions.js"),
    fs = require("fs")
var data = require('../data/guild-data.json')

exports.action = (message,args,client,prefix) => {
    if(!func.isAllowed(message,"admins") && func.getVar(message,"admins") != []) return func.error(message,"You are not allowed to use this command.")
    var th = "https://cdn.discordapp.com/attachments/379077116542582804/396595691964596224/unknown.png"
    if(args[0] == "" || args[0] == null)
    {
        var embed = new discord.MessageEmbed()
        embed.setColor("BLUE")
        embed.setThumbnail(th)
        embed.setTitle("Welcome to my configuration screen!")
        embed.setDescription("You may use the options below in conjunction with ``"+prefix+"configure``.\nThis screen is unfinished, more functionality will be coming soon!")
        embed.addField("Minimods [List/Add/Remove] <@Role>","Set the roles for Minimods.",false)
        embed.addField("Moderators [List/Add/Remove] <@Role>","Set the roles for Moderators.",false)
        embed.addField("Admins [List/Add/Remove] <@Role>","Set the roles for Admins.\nThis will grant access to special commands such as ``"+prefix+"configure``.",false)
        embed.addField("Useradmins [List/Add/Remove] <@User>","Gives an admin privilege to any user.",false)
        //embed.addField("Disable ["+prefix+"Command]","Disable usage of a certain command for all roles.",false)
        //embed.addField("Enable ["+prefix+"Command]","Re-enable usage of a disabled command.",false)
        //embed.addField("General [#Channel]","Set the channel that join/leave messages will be sent to.",false)
        //embed.addField("Prefix [Prefix]","Set the prefix used for commands.",false)
        //embed.addField("Reset","Reset everything in this guild's config data.",false)
        message.channel.send("",{embed:embed})
    }
    else if(args[0].toLowerCase() == "minimods")
    {
        if(args[1] == "" || args[1] == null)
        {
            message.channel.send("",{embed:new discord.MessageEmbed()
                .setColor("RED")
                .setThumbnail(th)
                .setDescription("You are missing an argument!\nUsage: ``"+prefix+"configure Minimods [List/Add/Remove] <@Role>``")
            })
        }
        else if(args[1].toLowerCase() == "add")
        {
            var minimods = func.getVar(message,"minimods")
            var role = message.mentions.roles.first()
            if(args[2] == "" || args[2] == null)
            {
                message.channel.send("",{embed:new discord.MessageEmbed()
                    .setColor("RED")
                    .setThumbnail(th)
                    .setDescription("You are missing an argument!\nUsage: ``"+prefix+"configure Minimods Add [@Role]``")
                })
            }
            else if(minimods[role.id])
            {
                message.channel.send("",{embed:new discord.MessageEmbed()
                    .setColor("RED")
                    .setThumbnail(th)
                    .setDescription("This role is already set up to be a Minimod.")
                })
            }
            else
            {
                minimods.push(role.id)
                fs.writeFileSync('../data/guild-data.json', JSON.stringify(data,null,4))
                message.channel.send("",{embed:new discord.MessageEmbed()
                    .setColor("GREEN")
                    .setThumbnail(th)
                    .setDescription("Successfully added "+role.name+" to Minimods.")
                })
            }
        }
        else if(args[1].toLowerCase() == "remove")
        {
            var minimods = func.getVar(message,"minimods")
            var role = message.mentions.roles.first()
            if(args[2] == "" || args[2] == null)
            {
                message.channel.send("",{embed:new discord.MessageEmbed()
                    .setColor("RED")
                    .setThumbnail(th)
                    .setDescription("You are missing an argument!\nUsage: ``"+prefix+"configure Minimods Remove [@Role]``")
                })
            }
            else if(!minimods[role.id])
            {
                message.channel.send("",{embed:new discord.MessageEmbed()
                    .setColor("RED")
                    .setThumbnail(th)
                    .setDescription("This role is not set up to be a Minimod.")
                })
            }
            else
            {
                minimods.splice(minimods.indexOf(role.id),1)
                fs.writeFileSync('./data/guild-data.json', JSON.stringify(data,null,4))
                message.channel.send("",{embed:new discord.MessageEmbed()
                    .setColor("GREEN")
                    .setThumbnail(th)
                    .setDescription("Successfully removed "+role.name+" from Minimods.")
                })
            }
        }
        else if(args[1].toLowerCase() == "list")
        {
            var pool = []
            var minimods = func.getVar(message,"minimods")
            for (var i = 0; i < minimods.length; i++) {
                pool.push("<@&"+minimods[i]+">")
            }
            message.channel.send("",{embed:new discord.MessageEmbed()
                .setColor("BLUE")
                .setThumbnail(th)
                .setTitle("Here are your current Minimod roles:")
                .setDescription(pool.join("\n"))
                .setFooter("I can also send the IDs of these roles using "+prefix+"configure Minimods ListIDs")
            })
        }
        else if(args[1].toLowerCase() == "listids")
        {
            var minimods = func.getVar(message,"minimods")
            message.channel.send("",{embed:new discord.MessageEmbed()
                .setColor("BLUE")
                .setThumbnail(th)
                .setTitle("Here are your current Minimod roles:")
                .setDescription(minimods.join("\n"))
            })
        }
    }
    else if(args[0].toLowerCase() == "mods")
    {
        if(args[1] == "" || args[1] == null)
        {
            message.channel.send("",{embed:new discord.MessageEmbed()
                .setColor("RED")
                .setThumbnail(th)
                .setDescription("You are missing an argument!\nUsage: ``"+prefix+"configure Mods [List/Add/Remove] <@Role>``")
            })
        }
        else if(args[1].toLowerCase() == "add")
        {
            var mods = func.getVar(message,"mods")
            var role = message.mentions.roles.first()
            if(args[2] == "" || args[2] == null)
            {
                message.channel.send("",{embed:new discord.MessageEmbed()
                    .setColor("RED")
                    .setThumbnail(th)
                    .setDescription("You are missing an argument!\nUsage: ``"+prefix+"configure Mods Add [@Role]``")
                })
            }
            else if(mods[role.id])
            {
                message.channel.send("",{embed:new discord.MessageEmbed()
                    .setColor("RED")
                    .setThumbnail(th)
                    .setDescription("This role is already set up to be a Moderator.")
                })
            }
            else
            {
                mods.push(role.id)
                fs.writeFileSync('./data/guild-data.json', JSON.stringify(data,null,4))
                message.channel.send("",{embed:new discord.MessageEmbed()
                    .setColor("GREEN")
                    .setThumbnail(th)
                    .setDescription("Successfully added "+role.name+" to Moderators.")
                })
            }
        }
        else if(args[1].toLowerCase() == "remove")
        {
            var mods = func.getVar(message,"mods")
            var role = message.mentions.roles.first()
            if(args[2] == "" || args[2] == null)
            {
                message.channel.send("",{embed:new discord.MessageEmbed()
                    .setColor("RED")
                    .setThumbnail(th)
                    .setDescription("You are missing an argument!\nUsage: ``"+prefix+"configure Mods Remove [@Role]``")
                })
            }
            else if(!mods[role.id])
            {
                message.channel.send("",{embed:new discord.MessageEmbed()
                    .setColor("RED")
                    .setThumbnail(th)
                    .setDescription("This role is not set up to be a Moderator.")
                })
            }
            else
            {
                mods.splice(mods.indexOf(role.id),1)
                fs.writeFileSync('./data/guild-data.json', JSON.stringify(data,null,4))
                message.channel.send("",{embed:new discord.MessageEmbed()
                    .setColor("GREEN")
                    .setThumbnail(th)
                    .setDescription("Successfully removed "+role.name+" from Moderators.")
                })
            }
        }
        else if(args[1].toLowerCase() == "list")
        {
            var pool = []
            var mods = func.getVar(message,"mods")
            for (var i = 0; i < mods.length; i++) {
                pool.push("<@&"+mods[i]+">")
            }
            message.channel.send("",{embed:new discord.MessageEmbed()
                .setColor("BLUE")
                .setThumbnail(th)
                .setTitle("Here are your current Moderator roles:")
                .setDescription(pool.join("\n"))
                .setFooter("I can also send the IDs of these roles using "+prefix+"configure Mods ListIDs")
            })
        }
        else if(args[1].toLowerCase() == "listids")
        {
            var mods = func.getVar(message,"mods")
            message.channel.send("",{embed:new discord.MessageEmbed()
                .setColor("BLUE")
                .setThumbnail(th)
                .setTitle("Here are your current Moderator roles:")
                .setDescription(mods.join("\n"))
            })
        }
    }
    else if(args[0].toLowerCase() == "admins")
    {
        if(args[1] == "" || args[1] == null)
        {
            message.channel.send("",{embed:new discord.MessageEmbed()
                .setColor("RED")
                .setThumbnail(th)
                .setDescription("You are missing an argument!\nUsage: ``"+prefix+"configure Admins [List/Add/Remove] <@Role>``")
            })
        }
        else if(args[1].toLowerCase() == "add")
        {
            var admins = func.getVar(message,"admins")
            var role = message.mentions.roles.first()
            if(args[2] == "" || args[2] == null)
            {
                message.channel.send("",{embed:new discord.MessageEmbed()
                    .setColor("RED")
                    .setThumbnail(th)
                    .setDescription("You are missing an argument!\nUsage: ``"+prefix+"configure Admins Add [@Role]``")
                })
            }
            else if(admins[role.id])
            {
                message.channel.send("",{embed:new discord.MessageEmbed()
                    .setColor("RED")
                    .setThumbnail(th)
                    .setDescription("This role is already set up to be an Admin.")
                })
            }
            else
            {
                admins.push(role.id)
                fs.writeFileSync('./data/guild-data.json', JSON.stringify(data,null,4))
                message.channel.send("",{embed:new discord.MessageEmbed()
                    .setColor("GREEN")
                    .setThumbnail(th)
                    .setDescription("Successfully added "+role.name+" to Admins.")
                })
            }
        }
        else if(args[1].toLowerCase() == "remove")
        {
            var admins = func.getVar(message,"admins")
            var role = message.mentions.roles.first()
            if(args[2] == "" || args[2] == null)
            {
                message.channel.send("",{embed:new discord.MessageEmbed()
                    .setColor("RED")
                    .setThumbnail(th)
                    .setDescription("You are missing an argument!\nUsage: ``"+prefix+"configure Admins Remove [@Role]``")
                })
            }
            else if(!admins[role.id])
            {
                message.channel.send("",{embed:new discord.MessageEmbed()
                    .setColor("RED")
                    .setThumbnail(th)
                    .setDescription("This role is not set up to be an Admin.")
                })
            }
            else
            {
                admins.splice(admins.indexOf(role.id),1)
                fs.writeFileSync('./data/guild-data.json', JSON.stringify(data,null,4))
                message.channel.send("",{embed:new discord.MessageEmbed()
                    .setColor("GREEN")
                    .setThumbnail(th)
                    .setDescription("Successfully removed "+role.name+" from Admins.")
                })
            }
        }
        else if(args[1].toLowerCase() == "list")
        {
            var pool = []
            var admins = func.getVar(message,"admins")
            for (var i = 0; i < admins.length; i++) {
                pool.push("<@&"+admins[i]+">")
            }
            message.channel.send("",{embed:new discord.MessageEmbed()
                .setColor("BLUE")
                .setThumbnail(th)
                .setTitle("Here are your current Admin roles:")
                .setDescription(pool.join("\n"))
                .setFooter("I can also send the IDs of these roles using "+prefix+"configure Admins ListIDs")
            })
        }
        else if(args[1].toLowerCase() == "listids")
        {
            var admins = func.getVar(message,"admins")
            message.channel.send("",{embed:new discord.MessageEmbed()
                .setColor("BLUE")
                .setThumbnail(th)
                .setTitle("Here are your current Admin roles:")
                .setDescription(admins.join("\n"))
            })
        }
    }
    else if(args[0].toLowerCase() == "useradmins")
    {
        if(args[1] == "" || args[1] == null)
        {
            message.channel.send("",{embed:new discord.MessageEmbed()
                .setColor("RED")
                .setThumbnail(th)
                .setDescription("You are missing an argument!\nUsage: ``"+prefix+"configure Useradmins [List/Add/Remove] <@User>``")
            })
        }
        else if(args[1].toLowerCase() == "add")
        {
            var useradmins = func.getVar(message,"useradmins")
            var role = message.mentions.members.first
            if(args[2] == "" || args[2] == null)
            {
                message.channel.send("",{embed:new discord.MessageEmbed()
                    .setColor("RED")
                    .setThumbnail(th)
                    .setDescription("You are missing an argument!\nUsage: ``"+prefix+"configure Useradmins Add [@User]``")
                })
            }
            else if(useradmins[role.id])
            {
                message.channel.send("",{embed:new discord.MessageEmbed()
                    .setColor("RED")
                    .setThumbnail(th)
                    .setDescription("This user is already set up to be a Useradmin.")
                })
            }
            else
            {
                useradmins.push(role.id)
                fs.writeFileSync('./data/guild-data.json', JSON.stringify(data,null,4))
                message.channel.send("",{embed:new discord.MessageEmbed()
                    .setColor("GREEN")
                    .setThumbnail(th)
                    .setDescription("Successfully added "+role.name+" to Useradmins.")
                })
            }
        }
        else if(args[1].toLowerCase() == "remove")
        {
            var useradmins = func.getVar(message,"useradmins")
            var role = message.mentions.roles.first()
            if(args[2] == "" || args[2] == null)
            {
                message.channel.send("",{embed:new discord.MessageEmbed()
                    .setColor("RED")
                    .setThumbnail(th)
                    .setDescription("You are missing an argument!\nUsage: ``"+prefix+"configure Userdmins Remove [@User]``")
                })
            }
            else if(!useradmins[role.id])
            {
                message.channel.send("",{embed:new discord.MessageEmbed()
                    .setColor("RED")
                    .setThumbnail(th)
                    .setDescription("This user is not set up to be a Useradmin.")
                })
            }
            else
            {
                useradmins.splice(useradmins.indexOf(role.id),1)
                fs.writeFileSync('./data/guild-data.json', JSON.stringify(data,null,4))
                message.channel.send("",{embed:new discord.MessageEmbed()
                    .setColor("GREEN")
                    .setThumbnail(th)
                    .setDescription("Successfully removed "+role.name+" from Useradmins.")
                })
            }
        }
        else if(args[1].toLowerCase() == "list")
        {
            var pool = []
            var useradmins = func.getVar(message,"useradmins")
            for (var i = 0; i < useradmins.length; i++) {
                pool.push("<@"+useradmins[i]+">")
            }
            message.channel.send("",{embed:new discord.MessageEmbed()
                .setColor("BLUE")
                .setThumbnail(th)
                .setTitle("Here are your current Useradmins:")
                .setDescription(pool.join("\n"))
                .setFooter("I can also send the IDs of these users using "+prefix+"configure Useradmins ListIDs")
            })
        }
        else if(args[1].toLowerCase() == "listids")
        {
            var useradmins = func.getVar(message,"useradmins")
            message.channel.send("",{embed:new discord.MessageEmbed()
                .setColor("BLUE")
                .setThumbnail(th)
                .setTitle("Here are your current Useradmins:")
                .setDescription(useradmins.join("\n"))
            })
        }
    }
}