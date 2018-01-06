exports.description = "Evaluate programming"
exports.perms = "admins"
exports.main = true

var discord = require("discord.js"),
    ordinal = require('ordinal-number-suffix'),
    request = require("request"),
    zalgo = require("to-zalgo"),
    bing = require("bing-image"),
    moment = require("moment"),
    func = require('../data/functions.js')

exports.action = (message, args, client, prefix) => {
    if(!func.isMain(message)) return func.error(message,"This server is not allowed to use this command.")
    message.channel.send("", {
        embed: {
            title: '🖥 JavaScript Eval',
            fields: [{
                    name: "Input",
                    value: args.join(" ")
                },
                {
                    name: "Output",
                    value: eval(args.join(" "))
                }
            ],
            color: 5561189
        }
    });
}