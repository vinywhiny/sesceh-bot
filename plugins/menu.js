let fs = require('fs')
let path = require('path')
let fetch = require('node-fetch')
let levelling = require('../lib/levelling')
const thumb = fs.readFileSync('./src/thumb.jpeg')
let tags = {
  'main': '𝕄𝕒𝕚𝕟',
  'game': '𝔾𝕒𝕞𝕖𝕤',
  'xp': '𝔼𝕩𝕡',
  'sticker': '𝕊𝕥𝕚𝕜𝕖𝕣',
  'kerang': '𝕂𝕖𝕣𝕒𝕟𝕘',
  'quotes': 'ℚ𝕦𝕠𝕥𝕖𝕤',
  'admin': '𝔸𝕕𝕞𝕚𝕟',
  'group': '𝔾𝕣𝕠𝕦𝕡',
  'premium': 'ℙ𝕣𝕖𝕞𝕚𝕦𝕞',
  'internet': '𝕀𝕟𝕥𝕖𝕣𝕟𝕖𝕥',
  'anonymous': '𝔸𝕟𝕠𝕟𝕪𝕞𝕠𝕦𝕤',
  'nulis': 'ℕ𝕦𝕝𝕚𝕤',
  'downloader': '𝔻𝕠𝕨𝕟𝕝𝕠𝕒𝕕',
  'tools': '𝕋𝕠𝕠𝕝𝕤',
  'fun': '𝔽𝕦𝕟',
  'database': '𝔻𝕒𝕥𝕒𝕓𝕒𝕤𝕖',
  'vote': '𝕍𝕠𝕥𝕚𝕟𝕘',
  'absen': '𝔸𝕓𝕤𝕖𝕟',
  'quran': '𝔸𝕝 ℚ𝕦𝕣\'𝕒𝕟',
  'jadibot': '𝕁𝕒𝕕𝕚𝕓𝕠𝕥',
  'owner': '𝕆𝕨𝕟𝕖𝕣',
  'host': 'ℍ𝕠𝕤𝕥',
  'advanced': '𝔸𝕕𝕧𝕒𝕟𝕔𝕖',
  'info': '𝕀𝕟𝕗𝕠',
  '': 'ℕ𝕠 𝕔𝕒𝕥𝕖𝕘𝕠𝕣𝕪',
}
const defaultMenu = {
  before: `
╭─「 %me 」
│ Hai, %name!
│ BUTTON SEDANG ERROR!
│ Tersisa *%limit Limit*
│ Level *%level (%exp / %maxexp)*
│ 
│ SC original: Narutomo
│ Recode: Rimuru
│
│ Uptime: *%uptime (%muptime)*
│ Database: %rtotalreg of %totalreg
│
│ Github: https://github.com/Ervan2525
│ YouTube: https://youtube.com/channel/UCQV7cLK7IY_MRMHH4phQORQ
╰────
%readmore`.trimStart(),
  header: '╭─「 %category 」',
  body: '│ ➣ %cmd %islimit %isPremium',
  footer: '╰────\n',
  after: `
*%npmname@^%version*
${'```%npmdesc```'}
`,
}
let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    let package = JSON.parse(await fs.promises.readFile(path.join(__dirname, '../package.json')).catch(_ => '{}'))
    let { exp, limit, level, role } = global.db.data.users[m.sender]
    let { min, xp, max } = levelling.xpRange(level, global.multiplier)
    let name = conn.getName(m.sender)
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    // d.getTimeZoneOffset()
    // Offset -420 is 18.00
    // Offset    0 is  0.00
    // Offset  420 is  7.00
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d)
    let time = d.toLocaleTimeString(locale, {
      hour12: false
    })
    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
      return {
        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      }
    })
    for (let plugin of help)
      if (plugin && 'tags' in plugin)
        for (let tag of plugin.tags)
          if (!(tag in tags) && tag) tags[tag] = tag
    conn.menu = conn.menu ? conn.menu : {}
    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body = conn.menu.body || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer
    let after = conn.menu.after || (conn.user.jid == global.conn.user.jid ? '' : `Powered by https://wa.me/${global.conn.user.jid.split`@`[0]}`) + defaultMenu.after
    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        return header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
            return menu.help.map(help => {
              return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
                .replace(/%islimit/g, menu.limit ? '(Limit)' : '')
                .replace(/%isPremium/g, menu.premium ? '(Premium)' : '')
                .trim()
            }).join('\n')
          }),
          footer
        ].join('\n')
      }),
      after
    ].join('\n')
    text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
    let replace = {
      '%': '%',
      p: _p, uptime, muptime,
      me: conn.user.name,
      npmname: package.name,
      npmdesc: package.description,
      version: package.version,
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      github: package.homepage ? package.homepage.url || package.homepage : '[unknown github url]',
      level, limit, name, weton, week, date, dateIslamic, time, totalreg, rtotalreg, role,
      readmore: readMore
    }
    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
    //Iya bang sy nub
    const reply = {
    key: {
        participant: '0@s.whatsapp.net'
    },
    message: {
        orderMessage: {
            itemCount: 1122334455,
            itemCoun: 404,
            surface: 404,
            message: `© ${conn.user.name}`,
            orderTitle: 'B',
            thumbnail: thumb,
            sellerJid: '0@s.whatsapp.net'
        }
    }
}
let fkon = { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: '16504228206@s.whatsapp.net' } : {}) }, message: { contactMessage: { displayName: `Relldev`, vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN: Rlxfly UwU\nitem1.TEL;waid=6283820073017:6283820073017\nitem1.X-ABLabel:Ponsel\nEND:VCARD`}}}
conn.sendButtonImg(m.chat, thumb, `*『${conn.user.name}』*`, text.trim(), '!owner', '!owner', reply)
  } catch (e) {
    conn.reply(m.chat, 'Maaf, menu sedang error', m)
    throw e
  }
}
handler.help = ['menu', 'help', '?']
handler.tags = ['main']
handler.command = /^(menu|help|\?)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 3


module.exports = handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
