let handler = async (m, { conn }) => {
  m.reply('Loading...')
  let res = `https://api.ichikaa.xyz/api/randomimage?q=yuri&apikey=kohalip`
  conn.sendFile(m.chat, res, 'bdsm.jpg', 'huu suka ama yuri', m)
}
handler.help = ['yuri']
handler.tags = ['anime']

handler.command = /^(yuri)$/i

module.exports = handler
