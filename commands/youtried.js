exports.description = "almost no effort was made"

const discord = require("discord.js")
exports.action = (msg) => {
    msg.channel.send('', {
        embed:new discord.MessageEmbed()
            .setImage("https://i.imgur.com/bAxMdQ0.png")
            .setColor("YELLOW")
            .setTitle("you vaguely tried")
            .setURL("https://imgur.com/bAxMdQ0")
    });
}