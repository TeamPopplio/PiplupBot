exports.description = "FEAR DEATHBIRD"

var discord = require("discord.js")
exports.action = (msg) => {
    msg.channel.send('', {
        embed:new discord.MessageEmbed()
            .setImage("https://i.imgur.com/pIxQQXA.png")
            .setColor("RED")
            .setTitle("DEATHBIRD.png")
            .setURL("https://i.imgur.com/pIxQQXA.png")
    });
}