exports.description = "Restarts the bot."
exports.perms = "admins"
exports.main = true

const func = require("../data/functions.js"),
    fs = require("fs")
var data = require("../data/guild-data.json")
exports.action = (message) => {
    if(!func.isMain(message)) return func.error(message,"This server is not allowed to use this command.")
    data.rscmd.restarting = true
    data.rscmd.channel = message.channel.id
    fs.writeFileSync('./data/guild-data.json', JSON.stringify(data,null,4))
    message.channel.send("Restarting...").then(message => {
        process.exit()
    })
}