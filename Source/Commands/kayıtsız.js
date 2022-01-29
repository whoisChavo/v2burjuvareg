const { MessageEmbed } = require('discord.js');
const RegisterData = require('../Schema/RegisterData');
const settings = require('../Settings/settings.json');

module.exports = {
  name: "kayıtsız",
  aliases: ["kayıtsız"],
  run: async(client, message, args) => {

    function embed(msg) {
      let embed = new MessageEmbed().setColor("WHITE").setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter(message.guild.name, message.guild.iconURL({dynamic:true})).setTimestamp().setDescription(msg)
    message.channel.send(embed)
    } 


    if (settings.RegisterStaff.some(x => !message.member.roles.cache.has(x)) &&!message.member.hasPermission(8)) return embed("Hata: Bu komudu kullanamazsın.");


    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!user || user.id === message.author.id || user.id === message.guild.OwnerID || user.bot || user.roles.highest.position >= message.member.roles.highest.position) return embed("Bu kullanıcıyı kayıtsıza atamam veya bir kullanıcı belirtmedin.")

    if(!user.roles.cache.has(settings.Unregistered)) {
    await user.roles.cache.filter(x => x.id !== settings.BoosterRole).forEach(r => {
      user.roles.remove(r.id)
    });
    await user.roles.add(settings.Unregistered);



    embed(`${user} kişisine başarıyla <@&${settings.Unregistered}> rolü verildi.`)
    message.react(settings.Yes)
  } else {
    embed(`Bu kullanıcıda zaten kayıtsız rolü bulunuyor.`)
  }
  }
}