const discord = require("discord.js"),
    package = require("../package.json")
exports.description = "Shows an invite link for "+package.name+" to join servers. Also shows a link for the /r/Pokemon Discord."
exports.action = (msg, args, client) => {
    var embed = new discord.MessageEmbed()
    embed.setColor("BLUE")
    embed.setTitle("Want to invite me to your server? Click this link!")
    embed.setURL("https://discordapp.com/oauth2/authorize?client_id="+client.user.id+"&scope=bot&permissions=67494992&scope=bot")
    embed.setDescription("Want to join the /r/Pokemon Discord? Check out this link!\nhttps://discord.gg/pokemon\n\nThank you for using "+package.name+"! ❤")
    msg.channel.send("",{embed:embed});
}