exports.description = "Displays a list of helpful commands."

const footers = require('../data/footers.js'),
    fs = require("fs"),
    func = require("../data/functions.js")
let tFooter;

exports.action = (msg, args, client, prefix) => {
    tFooter = Math.floor(Math.random() * 15) == 0 ? {
        text: footers[Math.floor(Math.random() * footers.length)],
        icon_url: 'https://cdn.rawgit.com/110Percent/beheeyem/gh-pages/include/favicon.png'
    } : null;
    var embed = {color:35071,footer:tFooter,fields:[]}
    var commands = {};
    cmdfiles = fs.readdirSync('./commands');
    cmdfiles.forEach(filename => {
        var cmdName = filename.split('.')[0];
        try {
            commands[cmdName] = require('./' + filename);
            if(!commands[cmdName].perms)
            {
                if(!commands[cmdName].main)
                    if(commands[cmdName].description)
                        embed.fields.push({name:prefix+cmdName,value:commands[cmdName].description,inline:true})
                    else
                        embed.fields.push({name:prefix+cmdName,value:"No description.",inline:true})
                else if(func.isMain(msg))
                    if(commands[cmdName].description)
                        embed.fields.push({name:prefix+cmdName,value:commands[cmdName].description,inline:true})
                    else
                        embed.fields.push({name:prefix+cmdName,value:"No description.",inline:true})
            }
            else if(func.isAllowed(msg,commands[cmdName].perms))
            {
                if(!commands[cmdName].main)
                    if(commands[cmdName].description)
                        embed.fields.push({name:prefix+cmdName,value:commands[cmdName].description,inline:true})
                    else
                        embed.fields.push({name:prefix+cmdName,value:"No description.",inline:true})
                else if(func.isMain(msg))
                    if(commands[cmdName].description)
                        embed.fields.push({name:prefix+cmdName,value:commands[cmdName].description,inline:true})
                    else
                        embed.fields.push({name:prefix+cmdName,value:"No description.",inline:true})
            }
        } catch (err) {
            if (err)
                console.log('Error in '.red + cmdName.yellow + '!'.red + '\n' + err.stack);
        }
    });
    msg.channel.send("",{embed:embed})

    /*msg.channel.send("", {
        embed: {
            color: 35071,
            fields: [{
                    name: "-help",
                    value: "Displays a list of Beeheyem-related commands.",
                    inline: true
                },
                {
                    name: "-dex",
                    value: "`-dex beheeyem`\n`-dex 606`\nShows information about a Pokémon.",
                    inline: true
                },
                {
                    name: "-ability",
                    value: "`-ability static`\nShows information about an ability.",
                    inline: true
                },
                {
                    name: "-item",
                    value: "`-item soothe bell`\nShows information about an item.",
                    inline: true
                },
                {
                    name: "-move",
                    value: "`-move quick attack`\nShows information about a move.",
                    inline: true
                },
                {
                    name: "-type",
                    value: "`-type psychic`\nShows the damage modifiers for a set\nof types.Multiple types can be entered.",
                    inline: true
                },
                {
                    name: '-convert',
                    value: '`-convert 5 km to mi`\nConvert a value between two units.',
                    inline: true
                },
                {
                    name: '-user-info',
                    value: '`-user-info <mention>`\nDisplays informaton on a user.',
                    inline: true
                }
            ],
            footer: tFooter
        }
    })*/
}