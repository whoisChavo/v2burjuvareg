const { MessageEmbed, Client } = require('discord.js');
const { MessageButton } = require('discord-buttons');
const client = new Client();
const settings = require('../Settings/settings.json');
const {lucyDatabase} = require('../Functions/lucyDatabase');
module.exports = {
  name: "kayıt",
  aliases: ["k", "kayıt"],
  run: async(client, message, args) => {
    
  function embed(msg) {
    let embed = new MessageEmbed().setColor("WHITE").setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter(message.guild.name, message.guild.iconURL({dynamic:true})).setTimestamp().setDescription(msg)
    message.channel.send(embed).sil(10)
  }
    if (settings.RegisterStaff.some(role => !message.member.roles.cache.has(role)) && !message.member.hasPermission(8)) return embed(`Bu komudu kullanmak için gerekli rollere veya izinlere sahip değilsin.`)

    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!user || user.id === message.author.id || user.id === message.guild.OwnerID || user.bot || user.roles.highest.position >= message.member.roles.highest.position) return embed("Bu kullanıcıyı kayıt edemem veya bir kullanıcı belirtmedin.")
    
    if(!args[1]) return embed("Hata: Bir isim belirtmelisin");
    let name_1 = args[1].charAt(0).replace("i", "İ").toLocaleUpperCase() + args[1].slice(1).toLocaleLowerCase();
 
   
    let name_2 = `● ${name_1}`
  
    await user.setNickname(`${name_2}`);

    if(!user.roles.cache.has(settings.ManRole) && !user.roles.cache.has(settings.WomanRole)) {
    const kanal = client.channels.cache.get("935687858142990347");

    var button_1 = new MessageButton()
    .setID("MAN")
    .setLabel("🚹 Erkek")
    .setStyle("gray")

    var button_2 = new MessageButton()
    .setID("WOMAN")
    .setLabel("🚺 Kadın")
    .setStyle("gray")
    
    let msgembed = new MessageEmbed()
    .setColor("WHITE")
    .setAuthor(message.member.displayName, message.author.avatarURL({dynamic:true}))
    .setDescription(`${user} kullanıcının adı başarıyla \`"${name_2}"\` olarak değiştirildi.\n\nLütfen 30 saniye alttaki butonlara basarak kullanıcının cinsiyetini belirleyin.\n\nKullanıcının eski isimlerine bakarak kaydetmeyi unutmayın! Eski isimler için \`${settings.botPrefix}isimler <@kullanıcı>\``)
    .setFooter(message.guild.name, message.guild.iconURL({dynamic:true}))
    .setTimestamp();

    let msg = await message.channel.send({ buttons : [ button_1, button_2 ], embed: msgembed})
    
    var filter = (button) => button.clicker.user.id === message.author.id;
   
    let collector = await msg.createButtonCollector(filter, { time: 30000 })

      collector.on("collect", async (button) => {
      message.react(settings.Yes)
      if(button.id === "MAN") {
      await lucyDatabase.man(user, message.author)
      await lucyDatabase.setusername(user, name_2, `<@&${settings.ManRole}>`)
      await button.think(true)
      await button.reply.edit(`${user} adlı kullanıcı başarıyla <@&${settings.ManRole}> rolüyle kayıt edildi`)
      kanal.send(`${user} adlı kullanıcı başarıyla kayıt edildi.Hoşgeldin \<a:KalpGif:896728944647225404> `).sil(7)
      }
      if(button.id === "WOMAN") {
      await lucyDatabase.woman(user, message.author)
      await lucyDatabase.setusername(user, name_2, `<@&${settings.WomanRole}>`)
      await button.think(true)
      await button.reply.edit(`${user} adlı kullanıcı başarıyla <@&${settings.WomanRole}> rolüyle kayıt edildi`)
      kanal.send(`${user} adlı kullanıcı başarıyla kayıt edildi.Hoşgeldin \<a:KalpGif:896728944647225404> `).sil(7)
  }
    });

    collector.on("end", async () => {
      msg.delete();
    });


  } else {
    await user.setNickname(name_2)
    lucyDatabase.setusername(user, name_2, "İsim Değiştirme")
    embed(`${user} kullanıcının adı başarıya \`"${name_2}"\` olarak değiştirildi.`)
  }

  }
}
