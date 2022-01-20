let fetch = require('node-fetch')
let handler = async(m, { conn, text }) => {
   let res = await fetch(API('Velgrynd', '/api/genshin', { chara: text }, 'apikey'))
   if (!res.ok) throw await res.text()
   let json = await res.json()
   let { name, quote, cv, description, image, city, url, element, weapon, rating } = json.result
   let capt = `*Genshin Character*\n\n*Name*: ${name}\n*Cv*: ${cv}\n*City*: ${city}\n*Element*: ${element}\n*Weapon*: ${weapon}\n*Rating*: ${rating}\n*Url*: ${url}\n*Description*: ${description}`
   conn.sendFile(m.chat, image, '', capt, m)
}

handler.command = /^chara(gi|genshin)?$/i
module.exports = handler