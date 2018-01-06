// This file is used for various functions for the bot to
// easily calculate anything without clutter it's main file.
// There may not be much documentation, I apologize.
// I hope this all makes sense to you. ♥

var discord = require("discord.js"),
    delay = require('delay'),
    fs = require('fs'),
    colors = require('colors'),
    moment = require("moment"),
    //data = JSON.parse(fs.readFileSync("./guild-data.json",'utf-8'))
    data = require("./guild-data.json")

exports.capitalizeFirstLetter = capitalizeFirstLetter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

exports.checkItalics = checkItalics
function checkItalics(msg) {
    let isShiny = false;
    var isFound = false;
    let urlBuild = 'https://play.pokemonshowdown.com/sprites/xyani/';
    var asteriskSplit = msg.content.replace(/#/g, '').replace(/\?/g, '').split("*");
    var pokeName;
    for (var i = 1; i < asteriskSplit.length - 1; i++) {
        pokeName = asteriskSplit[i].toLowerCase();
        if (pokeName.indexOf('shiny') != -1) {
            isShiny = true;
            pokeName = pokeName.replace(' shiny', '').replace('shiny ', '').replace('-shiny', '').replace('shiny-', '').replace('shiny', '');

        }
        pokeName = pokeName.replace(" ", "-");
        let imgPoke = pokeName.toLowerCase();
        for (let r in otherAliases) {
            imgPoke = imgPoke.replace(r, otherAliases[r]);
        }
        if (isShiny) urlBuild = 'https://play.pokemonshowdown.com/sprites/xyani-shiny/';
        request(urlBuild + imgPoke + ".gif", (err, response) => {;
            if (!err) {
                if (response.statusCode == 200) {
                    msg.channel.send('', {
                        files:[response.request.href]
                    });
                    isFound = true;
                }
            }
        });
        if (isFound) break;
    }
    if (!isFound) {
        var underSplit = msg.content.replace(/#/g, '').replace(/\?/g, '').split("_");
        var pokeName;
        for (var i = 1; i < underSplit.length - 1; i++) {
            pokeName = underSplit[i].toLowerCase();
            if (pokeName.indexOf('shiny') != -1) {
                isShiny = true;
                pokeName = pokeName.replace(' shiny', '').replace('shiny ', '').replace('-shiny', '').replace('shiny-', '').replace('shiny', '');
            }
            pokeName = pokeName.replace(" ", "-");
            let imgPoke = pokeName.toLowerCase();
            for (let r in otherAliases) {
                imgPoke = imgPoke.replace(r, otherAliases[r]);
            }
            if (isShiny) urlBuild = 'https://play.pokemonshowdown.com/sprites/xyani-shiny/';
            request(urlBuild + imgPoke + ".gif", (err, response) => {
                if (!err) {
                    if (response.statusCode == 200) {
                        isFound == true;
                        msg.channel.send("",{
                            files:[response.request.href]
                        });
                    }
                }
            });
            if (isFound) break;
        }
    }
}
exports.checkRestart = checkRestart
function checkRestart(client) {
    
    if(data.rscmd.restarting) {
        if(!client.channels.get(data.rscmd.channel).guild.available)
            return null
        client.channels.get(data.rscmd.channel).send(":ok_hand:",
            {embed:commands.embed}).then(() => {
            data.rscmd.restarting = false
            fs.writeFileSync('../data/guild-data.json', JSON.stringify(data,null,4))
        })
    }
}
exports.loadCommands = loadCommands
function loadCommands() {
    var cmds = {};
    var embed = new discord.MessageEmbed()
    let errCount = 0;
    let desc = []
    let errors = []
    cmdfiles = fs.readdirSync('./commands/');
    cmdfiles.forEach(filename => {
        var cmdName = filename.split('.')[0];
        try {
            cmds[cmdName] = require('../commands/' + filename);
            console.log('Loaded '.green + cmdName.yellow.bold);
            desc.push('Loaded **' + cmdName + '**');
        } catch (err) {
            if (err) {
                errCount++;
                console.log('Error in '.red + cmdName.yellow + '!'.red + '\n' + err.stack);
                desc.push('Error in **' + cmdName + '**!');
                errors.push({"cmd":cmdName,"err":err.stack})
            }
        }
    });
    embed.setDescription(desc.join("\n"))
    if(errCount > 0) embed.setColor("RED")
    else embed.setColor("GREEN")
    for (var i = 0; i < errors.length; i++) {
        embed.addField(errors[i].cmd,errors[i].err,true)
    }
    console.log('Loaded commands with '.cyan + (errCount > 0 ? errCount.toString().red : 'no'.green) + ` error${errCount == 1? '' : 's'}!`.cyan);
    embed.setTitle('Loaded commands with ' + (errCount > 0 ? errCount.toString() : 'no') + ` error${errCount == 1? '' : 's'}!`);
    return {cmds,embed};
}

exports.joinGuild = joinGuild
function joinGuild(guild)
{
    var embed = new discord.MessageEmbed()
    embed.setColor("GREEN")
    embed.setTitle(`Thanks for bringing me here to ${guild}`+"!")
    embed.setDescription("Here's some info about your guild before "+
        "configuring me:")
    embed.setThumbnail(guild.iconURL({format:"png"}))
    if(guild.large)
    {
        embed.addField(`${guild} has `+guild.memberCount+" members!",
        "Holy cow, that's a lot of people!",false)
    }
    else
    {
        embed.addField(`${guild} has `+guild.memberCount+" members!",
        "That's pretty cool isn't it?",false)
    }
    embed.addField(`The owner of ${guild} is `+guild.owner.user.tag+".",
        "He's a cool owner, not gonna lie!",false)
    embed.addField(`${guild} was created on `+
        moment(guild.createdAt).format('L')+".",
        "Seems like a good time to start a community!")
    embed.addField("I'm glad to be here!",
        `You can configure my settings for ${guild} using \`\`-configure\`\`.`)
    var channel = guild.systemChannel
    if(!channel) 
    {
        channel = guild.channels.find('name', 'general')
        if(!channel)
        {
            channel = guild.channels.find('name', 'chat')
            if(!channel)
            {
                channel = guild.channels.find('name', 'welcome')
                if(!channel)
                {
                    channel = guild.owner.user
                    embed.setFooter("You do not seem to have a channel to send"+
                        " this to, so I DM'd you this message. It is recommended"+
                        " to set a general channel via -configure.")
                }
            }
        }
    }
    return {embed,channel}
}

exports.getVar = getVar
function getVar(message,str)
{
    
    var index = findIndex(data.guilds,"id",message.guild.id)
    console.log(message.content+"\n"+str)
    return data.guilds[index][str]
}

exports.addGuild = addGuild
function addGuild(guild,general)
{
    
    var jsondata = {"id":"","minimods":[],"mods":[],"admins":[],"useradmins":[],"disabled":[],"general":"","prefix":"-"}
    jsondata.id = guild.id
    jsondata.general = general.id
    data.guilds.push(jsondata)
    return fs.writeFileSync('guild-data.json', JSON.stringify(data,null,4))
}

exports.removeGuild = removeGuild
function removeGuild(guild)
{
    
    var index = findIndex(data.guilds,"id",guild.id)
    data.guilds.splice(index, 1)
    return fs.writeFileSync('guild-data.json', JSON.stringify(data,null,4))
}

exports.isDisabled = isDisabled
function isDisabled(message,command)
{
    
    var index = findIndex(data.guilds,"id",message.guild.id)
    var e = false
    for (var i = 0; i < data.guilds[index].disabled.length; i++) {
        if(data.guilds[index].disabled[i] == command)
        {
            e = true
        }
    }
    if(isAllowed(message,"admins")) e = false
    return e
}

exports.isMain = isMain
function isMain(message)
{
    
    var e = false
    for (var i = 0; i < data.mainservers.length; i++) {
        if(data.mainservers[i] == message.guild.id)
        {
            e = true
        }
    }
    return e
}

exports.isAllowed = isAllowed
function isAllowed(message,role)
{
    
    var index = findIndex(data.guilds,"id",message.guild.id)
    var arole = ""
    if(message.author.id == message.guild.ownerID) return true
    for (var i = 0; i < data.guilds[index].minimods.length; i++) {
        if(message.member.roles.has(data.guilds[index].minimods[i]))
        {
            arole = "minimods"
        }
    }
    for (var i = 0; i < data.guilds[index].mods.length; i++) {
        if(message.member.roles.has(data.guilds[index].mods[i]))
        {
            arole = "mods"
        }
    }
    for (var i = 0; i < data.guilds[index].admins.length; i++) {
        if(message.member.roles.has(data.guilds[index].admins[i]))
        {
            arole = "admins"
        }
    }
    for (var i = 0; i < data.guilds[index].useradmins.length; i++) {
        if(message.author.id == data.guilds[index].useradmins[i])
        {
            arole = "admins"
        }
    }
    if(arole == "admins" || !role) return true
    else if(arole == "mods" && role == "minimods") return true
    else if(arole == role) return true
    else return false
}

exports.error = error
function error(message,error)
{
    return message.channel.send("",{embed:new discord.MessageEmbed()
        .setTitle("Error while processing this request:")
        .setDescription(error)
        .setColor("RED")
    })
}

exports.findIndex = findIndex
function findIndex(array, key, value)
{ 
    console.log("test")
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] == value) {
            return i;
        }
    }
    return null;
}

exports.colorID = colorID
function colorID(color)
{
    var index = findIndex(colorlist, "name", color);
    return colorlist[index].roleid;
}

exports.outputDexEntry = outputDexEntry
function outputDexEntry(names,entry,basespecies,prevolution,evolutions,otherformes,types,size,mass,egggroups,basestats,abilities,hiddenability,author,image,color,dexno,icon,url)
{
    var richembed = new discord.MessageEmbed()
    if(names[1] == null){
        richembed.setTitle("**" + names[0] + "**")
    } else {
        richembed.setTitle("**" + names[0] + " (" + names[1] + ")**")
    }
    if(entry == null) {
        richembed.setDescription("*No Pokédex entry found.*")
    } else {
        richembed.setDescription('"' + entry + '"')
    }
    if(basespecies != null) {richembed.addField("Base Species",basespecies,true)}
    if(prevolution == null) {richembed.addField("Prevolution","*No prevolution*",true)} else {richembed.addField("Prevolution",prevolution,true)}
    if(evolutions == null) {richembed.addField("Evolutions","*No evolutions*",true)} else {richembed.addField("Evolutions",evolutions.join("\n"),true)}
    if(otherformes != null) {richembed.addField("Other Formes",otherformes.join("\n"),true)}
    richembed.addField("Types",types.join("\n"))
    if(size != null) {richembed.addField("Size",size.toString(),true)}
    if(mass != null) {richembed.addField("Mass",mass.toString(),true)}
    if(egggroups == null) {richembed.addField("Egg groups","Undiscovered",true)} else {richembed.addField("Egg groups",egggroups,true)}
    richembed.addField("Base stats",basestats.join("/"),true)
    if(hiddenability != null) {richembed.addField("Abilities",abilities.join(", ") + "; *" + hiddenability + " (Hidden)*"),true} else {richembed.addField("Abilities",abilities.join(", "),true)}
    if(author != null) {richembed.addField("Author(s)",author.join("\n"),true)}
    if(image != null) {richembed.setImage(image)}
    if(color != null) {richembed.setColor(color)}
    if(url != null) {richembed.setURL(url)}
    if(icon == null) {richembed.setFooter(dexno)} else {richembed.setFooter(dexno,icon)}
    return richembed;
}

exports.containsAny = containsAny
function containsAny(str, substrings)
{
    for (var i = 0; i != substrings.length; i++) {
       var substring = substrings[i];
       if (str.indexOf(substring) != - 1) {
         return substring;
       }
    }
    return null; 
}

exports.clearColorRoles = clearColorRoles
function clearColorRoles(member)
{
    member.removeRole(colorID("midnight sky"))
    member.removeRole(colorID("dark blue"))
    member.removeRole(colorID("heart gold"))
    member.removeRole(colorID("crimson"))
    member.removeRole(colorID("pink"))
    member.removeRole(colorID("black"))
    member.removeRole(colorID("light blue"))
    member.removeRole(colorID("green"))
    member.removeRole(colorID("yellow"))
    member.removeRole(colorID("brown"))
    member.removeRole(colorID("blue"))
    member.removeRole(colorID("lime green"))
    member.removeRole(colorID("orange"))
    member.removeRole(colorID("pale blue"))
    member.removeRole(colorID("purple"))
    member.removeRole(colorID("white"))
    member.removeRole(colorID("red"))
}

exports.addColorRole = addColorRole
function addColorRole(member, colorrole) {
    member.addRole(colorID(colorrole));
}

exports.isInArray = isInArray
function isInArray(args, list)
{
    if(containsAny(args, list.join().toLowerCase().split(',')) != null){
        return true;
    } else {
        return null;
    }
}

exports.addColor = addColor
function addColor(member, colorrole)
{
    clearColorRoles(member)
    addColorRole(member, colorrole)
    return true;
}

exports.lovebar = lovebar
function lovebar(value)
{
    if(value < 10 && value != 0){
        return "█";
    } else if(value >= 10 && value < 20){
        return "██";
    } else if(value >= 20 && value < 30){
        return "███";
    } else if(value >= 30 && value < 40){
        return "████";
    } else if(value >= 40 && value < 50){
        return "█████";
    } else if(value >= 50 && value < 60){
        return "██████";
    } else if(value >= 60 && value < 70){
        return "███████";
    } else if(value >= 70 && value < 80){
        return "████████";
    } else if(value >= 80 && value < 90){
        return "█████████";
    } else if(value >= 90 && value < 100){
        return "██████████";
    } else if(value == 100){
        return "███████████";
    } else {
        return "N/A";
    }
} 

exports.conclusion = conclusion
function conclusion(value)
{
    if(value < 10 && value != 0){
        return ":broken_heart: This ship sank before it set sail...";
    } else if(value >= 10 && value < 30){
        return ":broken_heart: This ship will sink for sure...";
    } else if(value >= 30 && value < 50){
        return ":broken_heart: This doesn't look so good...";
    } else if(value >= 50 && value < 70){
        return ":heartpulse: A little rocky but it can work out!";
    } else if(value >= 70 && value < 100){
        return ":heart:️️ A good match!";
    } else if(value == 100){
        return ":sparkling_heart: True love!";
    } else {
        return "N/A";
    }
} 

exports.heart = heart
function heart(value)
{
    if(value < 5){
        return ":broken_heart:";
    } else {
        return ":heart:️️";
    }
} 

function outputDexEntry(names,entry,basespecies,prevolution,evolutions,otherformes,types,size,mass,egggroups,basestats,abilities,hiddenability,author,image,color,dexno,icon,url)
{
    var richembed = new discord.MessageEmbed()
    if(names[1] == null){
        richembed.setTitle("**" + names[0] + "**")
    } else {
        richembed.setTitle("**" + names[0] + " (" + names[1] + ")**")
    }
    if(entry == null) {
        richembed.setDescription("*No Pokédex entry found.*")
    } else {
        richembed.setDescription('"' + entry + '"')
    }
    if(basespecies != null) {richembed.addField("Base Species",basespecies,true)}
    if(prevolution == null) {richembed.addField("Prevolution","*No prevolution*",true)} else {richembed.addField("Prevolution",prevolution,true)}
    if(evolutions == null) {richembed.addField("Evolutions","*No evolutions*",true)} else {richembed.addField("Evolutions",evolutions.join("\n"),true)}
    if(otherformes != null) {richembed.addField("Other Formes",otherformes.join("\n"),true)}
    richembed.addField("Types",types.join("\n"))
    if(size != null) {richembed.addField("Size",size.toString(),true)}
    if(mass != null) {richembed.addField("Mass",mass.toString(),true)}
    if(egggroups == null) {richembed.addField("Egg groups","Undiscovered",true)} else {richembed.addField("Egg groups",egggroups,true)}
    richembed.addField("Base stats",basestats.join("/"),true)
    if(hiddenability != null) {richembed.addField("Abilities",abilities.join(", ") + "; *" + hiddenability + " (Hidden)*"),true} else {richembed.addField("Abilities",abilities.join(", "),true)}
    if(author != null) {richembed.addField("Author(s)",author.join("\n"),true)}
    if(image != null) {richembed.setImage(image)}
    if(color != null) {richembed.setColor(color)}
    if(url != null) {richembed.setURL(url)}
    if(icon == null) {richembed.setFooter(dexno)} else {richembed.setFooter(dexno,icon)}
    return richembed;
}
function containsAny(str, substrings)
{
    for (var i = 0; i != substrings.length; i++) {
       var substring = substrings[i];
       if (str.indexOf(substring) != - 1) {
         return substring;
       }
    }
    return null; 
}
function clearColorRoles(member)
{
    member.removeRole(colorID("midnight sky"))
    member.removeRole(colorID("dark blue"))
    member.removeRole(colorID("heart gold"))
    member.removeRole(colorID("crimson"))
    member.removeRole(colorID("pink"))
    member.removeRole(colorID("black"))
    member.removeRole(colorID("light blue"))
    member.removeRole(colorID("green"))
    member.removeRole(colorID("yellow"))
    member.removeRole(colorID("brown"))
    member.removeRole(colorID("blue"))
    member.removeRole(colorID("lime green"))
    member.removeRole(colorID("orange"))
    member.removeRole(colorID("pale blue"))
    member.removeRole(colorID("purple"))
    member.removeRole(colorID("white"))
    member.removeRole(colorID("red"))
}
function addColorRole(member, colorrole) {
    member.addRole(colorID(colorrole));
}
function isInArray(args, list)
{
    if(containsAny(args, list.join().toLowerCase().split(',')) != null){
        return true;
    } else {
        return null;
    }
}
function addColor(member, colorrole)
{
    clearColorRoles(member)
    addColorRole(member, colorrole)
    return true;
}
function lovebar(value)
{
    if(value < 10 && value != 0){
        return "█";
    } else if(value >= 10 && value < 20){
        return "██";
    } else if(value >= 20 && value < 30){
        return "███";
    } else if(value >= 30 && value < 40){
        return "████";
    } else if(value >= 40 && value < 50){
        return "█████";
    } else if(value >= 50 && value < 60){
        return "██████";
    } else if(value >= 60 && value < 70){
        return "███████";
    } else if(value >= 70 && value < 80){
        return "████████";
    } else if(value >= 80 && value < 90){
        return "█████████";
    } else if(value >= 90 && value < 100){
        return "██████████";
    } else if(value == 100){
        return "███████████";
    } else {
        return "N/A";
    }
} 
function conclusion(value)
{
    if(value < 10 && value != 0){
        return ":broken_heart: This ship sank before it set sail...";
    } else if(value >= 10 && value < 30){
        return ":broken_heart: This ship will sink for sure...";
    } else if(value >= 30 && value < 50){
        return ":broken_heart: This doesn't look so good...";
    } else if(value >= 50 && value < 70){
        return ":heartpulse: A little rocky but it can work out!";
    } else if(value >= 70 && value < 100){
        return ":heart:️️ A good match!";
    } else if(value == 100){
        return ":sparkling_heart: True love!";
    } else {
        return "N/A";
    }
} 
function heart(value)
{
    if(value < 5){
        return ":broken_heart:";
    } else {
        return ":heart:️️";
    }
} 