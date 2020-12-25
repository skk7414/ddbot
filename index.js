const Discord = require('discord.js');
const client = new Discord.Client();
const token = 'NzkyMDYwNDkyMDU4NzIyMzM1.X-YN0Q.DFZlT65_Syu1Zgg06rxXN6MB3H0';


client.on('message',(message) => {
    console.log('on!');
});


client.on('message', (message) => {
    if(message.content === 'ping') {
        message.reply('pong')
    }
});

// 청소
client.on('messageUpdate', async message => {
    message.channel.send(`<@!${message.author.id}> 님이 \`${message.content}\` 을(를) 수정하셨습니다.`)
  }) 

client.on('messageDelete', async message => {
    message.channel.send(`<@!${message.author.id}> 님이 \`${message.content}\` 을(를) 삭제하셨습니다.`)
  })
  
  // 도배
  
  let Cooltime_Mute = 3 * 1000 //밀리세컨드 
  // 3초내에 칠 시 뮤트
  let User_Mute_Object = {}
  client.on('message', async message => {
    let MuteRole = client.guilds.cache.get(message.guild.id).roles.cache.find(r => r.name === "Muted").id
    if (message.author.bot || !message.guild) return
    MuteRole = message.guild.roles.cache.find(r => r.id == MuteRole)
    const M_Author = message.author
    if (!message.member.hasPermission('ADMINISTRATOR')) {
      let Author_Object = User_Mute_Object[M_Author.id]
      if (!Author_Object) {
        User_Mute_Object[M_Author.id] = {
          time: 0,
          interval: null,
          muted: false
        }
      } else {
        if (Author_Object.interval != null) {
          if (Cooltime_Mute >= Author_Object.time && !Author_Object.muted) {
            message.member.roles.add(MuteRole)
            Author_Object.muted = true
            message.reply(`전 채팅과의 시간차 ${Author_Object.time}ms`)
          }
          clearInterval(Author_Object.interval)
          Author_Object.interval = null
        } else if (!Author_Object.muted) {
          Author_Object.interval = setInterval(() => {
            Author_Object.time++
          }, 1)
        }
        Author_Object.time = 0
      }
    }
    if (message.member.hasPermission('ADMINISTRATOR') && /!언뮤트 <@!?(\d{17,19})>/g.test(message.content)) {
      const Mention_member = message.mentions.members.first()
      Mention_member.roles.remove(MuteRole)
      User_Mute_Object[Mention_member.id].muted = false
      User_Mute_Object[Mention_member.id].time = 0
      message.channel.send(`${Mention_member}, 해방됨`)
    }
  })

client.login(token);