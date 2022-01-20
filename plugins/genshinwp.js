let fetch = require('node-fetch')
let handler = async(m, { conn, text }) => {
   let res = await fetch(API('Velgrynd', '/api/genshinweapon', { weapon: text }, 'apikey'))
   if (!res.ok) throw await res.text()
   let json = await res.json()
   let { name, baseatk, secstat, passive, r1, r2, url, r3, r4, r5, rating } = json.result
   let capt = `*Genshin Weapon*\n\n*Name*: ${name}\n*Baseatk*: ${baseatk}\n*Secstat*: ${secstat}\n*Passive*: ${passive}\n*Rating*: ${rating}\n*R1*: ${r1}\n*R2*: ${r2}\n*R3*: ${r3}\n*R4*: ${r4}\n*R5*: ${r5}`
   conn.sendFile(m.chat, url, '', capt, m)
}
handler.command = /^weapon(gi|genshin)?$/i
module.exports = handler