let handler = async (m, { conn }) => {
  m.reply('Loading...')
  let res = `https://api.ichikaa.xyz/api/randomimage/neko?apikey=79lJ9HEA`
  conn.sendFile(m.chat, res, 'neko.jpg', 'huu suka ama kucing', m)
}
handler.help = ['nekos']
handler.tags = ['anime']

handler.command = /^(nekos)$/i

module.exports = handler
