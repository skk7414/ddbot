const Discord = require("discord.js")
const intent_list = new Discord.Intents(["GUILD_MEMBERS", "GUILD_MESSAGES", "GUILDS", "GUILD_INVITES"])
const client = new Discord.Client({ ws: { intents: intent_list } })
const token = process.argv.length == 2 ? process.env.token : "" // heroku를 사용하지 않을꺼라면 const token = "디스코드 봇 토큰" 으로 바꿔주세요.
const welcomeChannelName = "" // 입장 시 환영메시지를 전송 할 채널의 이름을 입력하세요.
const byeChannelName = "" // 퇴장 시 메시지를 전송 할 채널의 이름을 입력하세요.
const welcomeChannelComment = "이서버에 오신걸 환영합니다.✨" // 입장 시 전송할 환영메시지의 내용을 입력하세요.
const byeChannelComment = "안녕히가세요.✨" // 퇴장 시 전송할 메시지의 내용을 입력하세요.
const roleName = "게스트" // 입장 시 지급 할 역할의 이름을 적어주세요.

client.on("ready", () => {
  console.log("켰다.")
  client.user.setPresence({ activity: { name: "24시간 서버관리중[/help]" }, status: "online" })
})

client.on("guildMemberAdd", (member) => {
  const guild = member.guild
  const newUser = member.user
  const welcomeChannel = guild.channels.cache.find((channel) => channel.name == welcomeChannelName)

  welcomeChannel.send(`<@${newUser.id}> ${welcomeChannelComment}\n`) // 올바른 채널명을 기입하지 않았다면, Cannot read property 'send' of undefined; 오류가 발생합니다.
  member.roles.add(guild.roles.cache.find((role) => role.name === roleName).id)
})

client.on("guildMemberRemove", (member) => {
  const guild = member.guild
  const deleteUser = member.user
  const byeChannel = guild.channels.cache.find((channel) => channel.name == byeChannelName)

  byeChannel.send(`<@${deleteUser.id}> ${byeChannelComment}\n`) // 올바른 채널명을 기입하지 않았다면, Cannot read property 'send' of undefined; 오류가 발생합니다.
})


// 청소
client.on('messageUpdate', async message => {
    message.channel.send(`<@!${message.author.id}> 님이 \`${message.content}\` 을(를) 수정하셨습니다.`)
  }) 

client.on('messageDelete', async message => {
    message.channel.send(`<@!${message.author.id}> 님이 \`${message.content}\` 을(를) 삭제하셨습니다.`)
  })
  
  //뮤트

let Cooltime_Mute = 3 * 1000 //밀리세컨드 
// 2초내에 칠 시 뮤트
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
