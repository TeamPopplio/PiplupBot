exports.description = "Displays information from the node package."

const discord = require("discord.js"),
    package =  require("../package.json")
exports.action = (msg, args, client) => {
    var embed = new discord.MessageEmbed()
    embed.setThumbnail(client.user.avatarURL({format:"png"}))
    embed.setColor("BLUE")
    embed.setTitle(client.user.username+"'s Information:")
    if(package.homepage) embed.setURL(package.homepage)
    if(package.name) embed.addField("Package Name:",package.name,true)
    if(package.author) embed.addField("Author:",package.author,true)
    if(package.maintainers)
    {
        let pool = []
        for (var i = 0; i < package.maintainers.length; i++)
        {
            pool.push(package.maintainers[i].name)
        }
        embed.addField("Maintainers:",pool.join(",\n"),true)
    }
    if(package.contributors)
    {
        let pool = []
        for (var i = 0; i < package.contributors.length; i++)
        {
            pool.push(package.contributors[i].name)
        }
        embed.addField("Contributors:",pool.join(",\n"),true)
    }
    if(package.dependencies) embed.addField("Dependencies:",Object.keys(package.dependencies).join(",\n"),true)
    if(package.license)
    {
        embed.addField("License:",package.license,true)
        if(fs.existsSync("./LICENSE")) {embed.attachFiles(["./LICENSE"])}
    }
    msg.channel.send('', {embed:embed});
}