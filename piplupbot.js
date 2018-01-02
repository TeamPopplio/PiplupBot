//=========\\
// Modules: \\
//////////////////////////////////////////////////////
const discord = require("discord.js"),              // Discord integration
    fs = require('fs'),                             // Filesystem writing
    ordinal = require('ordinal-number-suffix'),     // Adds ordinals to integers
    request = require("request"),                   // Sends HTTP requests to web APIs
    zalgo = require("to-zalgo"),                    // Zalgolizes text
    bing = require("bing-image"),                   // Grabs the daily image from Bing
    moment = require("moment"),                     // Better usage of dates
    colors = require('colors')                      // Use of colors in console
    token = fs.readFileSync("./token.txt",'utf-8')  // The bot's token to log into
//////////////////////////////////////////////////////

//===============\\
// Bot variables: \\
//////////////////////////////////////////////////
var client = new discord.Client(),              // This is the bot's client object.
    func = require('./data/functions.js'),      // This file contains functions that will be used for various commands.
    commands = func.loadCommands();             // This will load the various commands that are used.   
//////////////////////////////////////////////////

//========\\
// Events: \\
//////////////////////////////////////////////////////////////////////////
client.login(token)                                                     // This will log into Discord as your bot.
client.on('ready', () => {                                              // When the client is ready to recieve requests.
    var data = require('./data/guild-data.json')                        //
    if(data.rscmd.restarting) {                                         // If the bot is currently attempting to restart.
        if(!client.channels.get(data.rscmd.channel).guild.available)    //
            return null                                                 // Don't do anything, there's a server outage taking place.
        client.channels.get(data.rscmd.channel).send(":ok_hand:",       //
            {embed:commands.embed}).then(() => {                        //
            data.rscmd.restarting = false                               //
            fs.writeFileSync('./data/guild-data.json',                  // Write false to the json.
                JSON.stringify(data,null,4))                            //
        })                                                              //
    }                                                                   //
    console.log("Ready, awaiting commands. "                            //
        + "I am currently in " + String(client.guilds.size).yellow.bold //
        + " guilds.");                                                  // This message will appear if you have successfully activated your bot.
    client.user.setActivity("out for commands!",{type:"WATCHING"})      // Sets the bot's activity to "Watching out for commands!"
})                                                                      //
//////////////////////////////////////////////////////////////////////////
client.on('guildMemberAdd', member => {                                 // Sends a welcome message for new users to the guild, mentioning the member. (Although they won't be pinged)
    if(!member.guild.available) return null                             // Don't do anything, there's a server outage taking place.
    var embed = new discord.MessageEmbed()                              //
    embed.setColor("GREEN")                                             //
    embed.setTitle("Welcome to " + member.guild.name + "!")             //
    embed.setDescription(member + " has joined the server." +           //
        "\nPlease read the rules and if you have any questions" +       //
        "\nor need help, be sure to ask a moderator or an admin.")      //
    embed.addField("Did you know that you are our " +                   //
    ordinal(member.guild.memberCount) + " member?",                     // Display their number as an ordinal (1st, 2nd, 3rd, etc.)
        "Pretty cool, right?",false)                                    //
    client.channels.get(func.getVar(member,"general"))                  //
        .send("",{embed:embed})                                         //
    console.log(member.user.tag + ' has joined '                        //
        + member.guild.name + ".");                                     // Logging action to console.
});                                                                     //
//////////////////////////////////////////////////////////////////////////
client.on('guildMemberRemove',member => {                               // Sends a message to the guild for those who left the server.
    if(!member.guild.available) return null                             // Don't do anything, there's a server outage taking place.
    if(member.id == client.user.id) return null                         // The bot was kicked from the guild, don't attempt to send a leave message.
    var embed = new discord.MessageEmbed()                              //
    embed.setColor("RED")                                               //
    embed.setTitle(member.user.tag + " has left "                       //
        + member.guild.name + ".")                                      //
    embed.setDescription("We're sorry to see them go! " +               //
        "\n\nCurrent member count: " + member.guild.memberCount + ".")  //
    client.channels.get(func.getVar(member,"general")).send("",         //
        {embed: embed})                                                 //
    console.log(member.user.tag + ' has left '                          //
        + member.guild.name + ".");                                     // Logging action to console.
});                                                                     //
//////////////////////////////////////////////////////////////////////////
client.on("guildCreate", guild => {                                     // Sends a message whenever the bot is invited to a guild.
    if(!guild.available) return null                                    // Don't do anything, there's a server outage taking place.
    var joined = func.joinGuild(guild)                                  // The code was moved to functions as it is too long.
    joined.channel.send("",{embed:joined.embed})                        // 
    func.addGuild(guild,joined.channel)                                 // Add the guild and welcome channel to the data json.
    console.log("Client has been authorized into "+guild.name+".");     // Logging action to console.
})                                                                      //
//////////////////////////////////////////////////////////////////////////
client.on("guildDelete", guild => {                                     // Remove guild info whenever the bot is removed from one.
    if(!guild.available) return null                                    // Don't do anything, there's a server outage taking place.
    func.removeGuild(guild)                                             // Delete this guild's data from the data json.
    console.log("Client has been removed from "+guild.name+".");        // Logging action to console.
})                                                                      //
//////////////////////////////////////////////////////////////////////////
client.on("message", message => {                                       // Check for any messages sent and see if they're commands or not.
    var prefix = func.getVar(message,"prefix"),                         // Prefixes can be set per-guild, so we're just getting this guild's prefix before continuing.
        commandstring = message.content.substring(prefix.length),       //
        data = require('./data/guild-data.json')                        // This file contains saved information for members and their use of commands.
        cmd = commandstring.split(" ")[0];                              //
    let args = message.content.split(' ').slice(1)                      //
    console.log(data)
    if(message.author.id == client.user.id)                             //
        return null;                                                    // Ignore the message as it was sent by the bot.
    else if(!message.content.startsWith(prefix)                         //
        && !message.mentions.has(client.user))                          //
        return func.checkItalics(message)                               // Check to see if they're trying to grab a Pokemon image.
    else if(message.content.includes("@everyone")                       //
        || message.content.includes("@here")) {                         //
        if(!func.isAllowed(message,"mods")) return null}                // Someone is trying to use @everyone within the bot; if they're not a mod, ignore the message.
    else if(commands.cmds[cmd]) {                                       //
        if(func.isDisabled(message,cmd))                                //
            return func.error(message,                                  //
                "This command has been disabled.")                      // Command has been disabled by the guild.
        if(!func.isAllowed(message,commands.cmds[cmd].perms))           //
            return func.error(message,                                  // User is not allowed to use the command.
                "You are not allowed to use this command.")             //
        try {                                                           //
            commands.cmds[cmd].action(message, args, client, prefix);   // Attempt to use the command provided.
        } catch (err) {                                                 //
            func.error(message,err)                                     // Send error to chat.
            return console.error(err);                                  // Log any command errors to console.
        }                                                               //
    }                                                                   //
})                                                                      //
//////////////////////////////////////////////////////////////////////////
